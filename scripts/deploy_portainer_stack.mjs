#!/usr/bin/env node

import { randomBytes } from "node:crypto";
import { appendFileSync, existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawn } from "node:child_process";

const projectDir = resolve(process.cwd());
const projectEnvPath = resolve(projectDir, ".env");

const config = {
  appEnvFiles: [".env"],
  imageName: "go_atendi:latest",
  localTarPath: resolve(projectDir, "go_atendi.tar"),
  stackName: "goatendi_site",
  serviceName: "goatendi_site",
  dbServiceName: "goatendi_site_db",
  stackTemplatePath: resolve(projectDir, "deploy", "stack.template.yml"),
  domain: "https://goatendi.com",
  databasePasswordKey: "GO_ATENDI_DATABASE_PASSWORD",
  remoteTarDir: "/root/docker_vps_tar"
};

async function main() {
  try {
    const args = process.argv.slice(2);
    const skipUrlCheck = args.includes("--skip-url-check");
    const appEnv = loadEnvFiles(config.appEnvFiles.map((file) => resolve(projectDir, file)));
    const deployNonce = new Date().toISOString();

    const sshTarget = `${required(appEnv, "SOLLUCION_DEV_USER", projectEnvPath)}@${required(appEnv, "SOLLUCION_DEV_HOST", projectEnvPath)}`;
    const sshPassword = required(appEnv, "SOLLUCION_DEV_PASSWORD", projectEnvPath);
    const portainerUrl = normalizeUrl(required(appEnv, "SOLLUCION_DEV_PORTAINER_URL", projectEnvPath));
    const portainerToken = required(appEnv, "SOLLUCION_DEV_PORTAINER_TOKEN", projectEnvPath);
    const endpointId = await resolveEndpointId(portainerUrl, portainerToken, appEnv.SOLLUCION_DEV_PORTAINER_ENDPOINT_ID);

    const envMap = {
      APP_IMAGE: config.imageName,
      GO_ATENDI_DATABASE_PASSWORD: resolvePassword(appEnv, config.databasePasswordKey),
      SECRET_KEY_BASE: required(appEnv, "SECRET_KEY_BASE", ".env"),
      GOOGLE_CLIENT_ID: appEnv.GOOGLE_CLIENT_ID ?? "",
      GOOGLE_CLIENT_SECRET: appEnv.GOOGLE_CLIENT_SECRET ?? "",
      DEPLOY_NONCE: deployNonce
    };

    const stackContent = renderStackTemplate(readFileSync(config.stackTemplatePath, "utf8"), envMap);

    await buildAndSave();
    await ensureRemoteDockerState(sshTarget, sshPassword);
    const swarmId = await resolveSwarmId(sshTarget, sshPassword);
    await uploadTar(sshTarget, sshPassword);
    await remoteDockerLoad(sshTarget, sshPassword);
    await verifyRemoteImage(sshTarget, sshPassword);
    await upsertStack(portainerUrl, portainerToken, endpointId, swarmId, stackContent);
    await waitForStackReadiness(sshTarget, sshPassword);

    if (!skipUrlCheck) {
      await verifyUrl(sshTarget, sshPassword);
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}

function loadEnvFiles(paths) {
  return paths.reduce((acc, path) => {
    if (!existsSync(path)) {
      return acc;
    }

    return { ...acc, ...parseEnv(readFileSync(path, "utf8")) };
  }, {});
}

function parseEnv(content) {
  return content.split(/\r?\n/).reduce((acc, rawLine) => {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      return acc;
    }

    const separator = line.indexOf("=");
    if (separator === -1) {
      return acc;
    }

    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();

    if (
      (value.startsWith("\"") && value.endsWith("\"")) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    acc[key] = value;
    return acc;
  }, {});
}

function required(env, key, scope) {
  const value = env[key];
  if (!value) {
    throw new Error(`Falta ${key} em ${scope}`);
  }

  return value;
}

function resolvePassword(rootEnv, key) {
  if (rootEnv[key]) {
    return rootEnv[key];
  }

  const generated = randomBytes(24).toString("hex");
  appendFileSync(projectEnvPath, `\n${key}=${generated}\n`);
  rootEnv[key] = generated;
  return generated;
}

function normalizeUrl(url) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function renderStackTemplate(template, envMap) {
  return template.replace(/\$\{([A-Z0-9_]+)\}/g, (_, key) => {
    if (!(key in envMap)) {
      throw new Error(`Placeholder sem valor: ${key}`);
    }

    return JSON.stringify(String(envMap[key]));
  });
}

async function buildAndSave() {
  await run("docker", ["build", "--platform", "linux/amd64", "-t", config.imageName, "."], { cwd: projectDir });
  await run("docker", ["save", "-o", config.localTarPath, config.imageName], { cwd: projectDir });
}

async function resolveEndpointId(portainerUrl, token, explicitId) {
  if (explicitId) {
    return Number(explicitId);
  }

  const endpoints = await portainerRequest(portainerUrl, token, "/api/endpoints");
  if (!Array.isArray(endpoints) || endpoints.length === 0) {
    throw new Error("Nenhum endpoint do Portainer encontrado");
  }

  if (endpoints.length > 1) {
    throw new Error("Mais de um endpoint encontrado. Defina SOLLUCION_DEV_PORTAINER_ENDPOINT_ID no .env do projeto.");
  }

  return endpoints[0].Id;
}

async function ensureRemoteDockerState(sshTarget, sshPassword) {
  await runSsh(sshTarget, sshPassword, [
    `mkdir -p ${config.remoteTarDir} && ` +
      `test "$(docker info --format '{{.Swarm.LocalNodeState}}')" = "active" && ` +
      `(docker network inspect SollucionNet >/dev/null 2>&1 || docker network create --driver overlay --attachable SollucionNet)`
  ]);
}

async function resolveSwarmId(sshTarget, sshPassword) {
  const { stdout } = await runSsh(sshTarget, sshPassword, ["docker info --format '{{.Swarm.Cluster.ID}}'"], { capture: true });
  const swarmId = stdout.trim();
  if (!swarmId) {
    throw new Error("Nao foi possivel descobrir o Swarm ID remoto");
  }

  return swarmId;
}

async function uploadTar(sshTarget, sshPassword) {
  await runScp(sshTarget, sshPassword, [config.localTarPath, `${sshTarget}:${config.remoteTarDir}/`]);
}

async function remoteDockerLoad(sshTarget, sshPassword) {
  await runSsh(sshTarget, sshPassword, [`docker load -i ${config.remoteTarDir}/go_atendi.tar`]);
}

async function verifyRemoteImage(sshTarget, sshPassword) {
  await runSsh(sshTarget, sshPassword, [`docker image inspect ${config.imageName} >/dev/null`]);
}

async function upsertStack(portainerUrl, token, endpointId, swarmId, stackFileContent) {
  const existingStacks = await portainerRequest(portainerUrl, token, "/api/stacks");
  const existing = Array.isArray(existingStacks)
    ? existingStacks.find((stack) => stack.Name === config.stackName && stack.EndpointId === endpointId)
    : null;

  if (existing) {
    await portainerRequest(
      portainerUrl,
      token,
      `/api/stacks/${existing.Id}?endpointId=${endpointId}&method=string&type=1`,
      {
        method: "PUT",
        body: JSON.stringify({
          StackFileContent: stackFileContent,
          Env: [],
          Prune: true,
          PullImage: false
        })
      }
    );
    return;
  }

  await portainerRequest(
    portainerUrl,
    token,
    `/api/stacks/create/swarm/string?endpointId=${endpointId}`,
    {
      method: "POST",
      body: JSON.stringify({
        Name: config.stackName,
        SwarmID: swarmId,
        StackFileContent: stackFileContent,
        Env: [],
        Prune: true,
        FromAppTemplate: false
      })
    }
  );
}

async function waitForStackReadiness(sshTarget, sshPassword) {
  const services = [
    `${config.stackName}_${config.serviceName}`,
    `${config.stackName}_${config.dbServiceName}`
  ];
  const timeoutAt = Date.now() + 10 * 60 * 1000;

  while (Date.now() < timeoutAt) {
    const checks = await Promise.all(
      services.map(async (serviceName) => {
        const { stdout } = await runSsh(
          sshTarget,
          sshPassword,
          [`docker service ls --filter name=${serviceName} --format '{{.Replicas}}'`],
          { capture: true }
        );
        return stdout.trim();
      })
    );

    if (checks.every((replicas) => replicas === "1/1")) {
      return;
    }

    await sleep(5000);
  }

  throw new Error(`Timeout esperando stack ${config.stackName} ficar 1/1`);
}

async function verifyUrl(sshTarget, sshPassword) {
  await runSsh(sshTarget, sshPassword, [`curl -kfsSIL ${config.domain} >/dev/null`]);
}

async function portainerRequest(baseUrl, token, path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": token,
      ...(options.headers ?? {})
    }
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Portainer ${response.status} em ${path}: ${text}`);
  }

  return text ? JSON.parse(text) : null;
}

async function run(command, args, options = {}) {
  const { cwd = projectDir, capture = false, env = {} } = options;
  return await new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(command, args, {
      cwd,
      env: {
        ...process.env,
        ...env
      },
      stdio: capture ? ["ignore", "pipe", "pipe"] : "inherit"
    });

    let stdout = "";
    let stderr = "";

    if (capture) {
      child.stdout.on("data", (chunk) => {
        stdout += chunk;
      });
      child.stderr.on("data", (chunk) => {
        stderr += chunk;
      });
    }

    child.on("error", rejectPromise);
    child.on("close", (code) => {
      if (code === 0) {
        resolvePromise({ stdout, stderr });
        return;
      }

      rejectPromise(new Error(`${command} ${args.join(" ")} falhou com codigo ${code}${stderr ? `: ${stderr}` : ""}`));
    });
  });
}

async function runSsh(sshTarget, sshPassword, remoteArgs, options = {}) {
  return await run(
    "sshpass",
    ["-e", "ssh", "-o", "StrictHostKeyChecking=no", sshTarget, ...remoteArgs],
    {
      ...options,
      env: {
        ...(options.env ?? {}),
        SSHPASS: sshPassword
      }
    }
  );
}

async function runScp(sshTarget, sshPassword, scpArgs, options = {}) {
  return await run(
    "sshpass",
    ["-e", "scp", "-o", "StrictHostKeyChecking=no", ...scpArgs],
    {
      ...options,
      env: {
        ...(options.env ?? {}),
        SSHPASS: sshPassword
      }
    }
  );
}

function sleep(ms) {
  return new Promise((resolvePromise) => setTimeout(resolvePromise, ms));
}

await main();
