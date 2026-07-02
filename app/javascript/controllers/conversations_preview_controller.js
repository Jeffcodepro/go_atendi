import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "page",
    "screenTitle",
    "tab",
    "conversationCard",
    "listEmpty",
    "loadedMessage",
    "emptyPanel",
    "emptyTitle",
    "chatPanel",
    "detailsPanel",
    "chatAvatar",
    "chatName",
    "chatMeta",
    "detailsAvatar",
    "detailsName",
    "detailsEmail",
    "detailsPhone",
    "detailsHandle",
    "detailsStatus",
    "messages",
    "replyBox",
    "resolveButton",
    "resolveMenu",
    "quickModal",
    "filterPanel",
    "sortPanel"
  ]

  connect() {
    this.currentFilter = "all"
    this.currentConfig = this.filterConfig("Todas as conversas")
    this.activeTab = "mine"
    this.notificationsExpanded = false

    this.applyCurrentView()
    this.closeAllFloatingMenus()
    this.bindNotificationToggle()
  }

  disconnect() {
    if (this.notificationToggleButton && this.boundToggleNotificationExpansion) {
      this.notificationToggleButton.removeEventListener("click", this.boundToggleNotificationExpansion)
    }
  }

  bindNotificationToggle() {
    this.notificationToggleButton = this.element.querySelector('[aria-label="Ir para próxima conversa"]')

    if (!this.notificationToggleButton) return

    this.boundToggleNotificationExpansion = this.toggleNotificationExpansion.bind(this)
    this.notificationToggleButton.addEventListener("click", this.boundToggleNotificationExpansion)

    this.syncNotificationToggleIcon()
  }

  toggleNotificationExpansion(event) {
    event.stopPropagation()

    this.closeAllFloatingMenus()
    this.closeConversation()

    this.setNotificationExpansion(!this.notificationsExpanded)
  }

  setNotificationExpansion(expanded) {
    this.notificationsExpanded = expanded

    this.element.classList.toggle("is-notifications-expanded", expanded)

    this.applyNotificationExpansionLayout()
    this.syncNotificationToggleIcon()
  }

  applyNotificationExpansionLayout() {
    const conversationList = this.element.querySelector(".go-mini-conversations-list")
    const listBody = this.element.querySelector(".go-mini-conversations-list__body")
    const listHeader = this.element.querySelector(".go-mini-conversations-list__header")
    const emptyPanel = this.element.querySelector(".go-mini-conversations-empty")
    const chatPanel = this.element.querySelector(".go-mini-chat-panel")
    const contactPanel = this.element.querySelector(".go-mini-contact-panel")

    if (this.notificationsExpanded) {
      this.element.style.gridTemplateColumns = "minmax(0, 1fr)"

      if (conversationList) {
        conversationList.style.gridColumn = "1 / -1"
        conversationList.style.width = "100%"
        conversationList.style.maxWidth = "none"
        conversationList.style.minWidth = "0"
        conversationList.style.borderRight = "0"
      }

      if (listHeader) {
        listHeader.style.width = "100%"
      }

      if (listBody) {
        listBody.style.width = "100%"
        listBody.style.maxWidth = "none"
        listBody.style.minWidth = "0"
        listBody.style.background = "#ffffff"
      }

      if (emptyPanel) emptyPanel.style.display = "none"
      if (chatPanel) chatPanel.style.display = "none"
      if (contactPanel) contactPanel.style.display = "none"

      this.conversationCardTargets.forEach((card) => {
        this.applyExpandedCardLayout(card)
      })

      if (this.hasLoadedMessageTarget) {
        this.loadedMessageTarget.style.width = "100%"
        this.loadedMessageTarget.style.maxWidth = "none"
        this.loadedMessageTarget.style.borderRight = "0"
        this.loadedMessageTarget.style.textAlign = "center"
      }

      if (this.hasListEmptyTarget) {
        this.listEmptyTarget.style.width = "100%"
        this.listEmptyTarget.style.maxWidth = "none"
        this.listEmptyTarget.style.textAlign = "center"
      }
    } else {
      this.element.style.gridTemplateColumns = ""

      if (conversationList) {
        conversationList.style.gridColumn = ""
        conversationList.style.width = ""
        conversationList.style.maxWidth = ""
        conversationList.style.minWidth = ""
        conversationList.style.borderRight = ""
      }

      if (listHeader) {
        listHeader.style.width = ""
      }

      if (listBody) {
        listBody.style.width = ""
        listBody.style.maxWidth = ""
        listBody.style.minWidth = ""
        listBody.style.background = ""
      }

      if (emptyPanel) emptyPanel.style.display = ""
      if (chatPanel) chatPanel.style.display = ""
      if (contactPanel) contactPanel.style.display = ""

      this.conversationCardTargets.forEach((card) => {
        this.resetExpandedCardLayout(card)
      })

      if (this.hasLoadedMessageTarget) {
        this.loadedMessageTarget.style.width = ""
        this.loadedMessageTarget.style.maxWidth = ""
        this.loadedMessageTarget.style.borderRight = ""
        this.loadedMessageTarget.style.textAlign = ""
      }

      if (this.hasListEmptyTarget) {
        this.listEmptyTarget.style.width = ""
        this.listEmptyTarget.style.maxWidth = ""
        this.listEmptyTarget.style.textAlign = ""
      }
    }
  }

  applyExpandedCardLayout(card) {
    let checkbox = card.querySelector(".go-mini-expanded-check")

    if (!checkbox) {
      checkbox = document.createElement("span")
      checkbox.classList.add("go-mini-expanded-check")
      card.prepend(checkbox)
    }

    card.style.position = "relative"
    card.style.width = "100%"
    card.style.maxWidth = "none"
    card.style.minWidth = "0"
    card.style.minHeight = "64px"
    card.style.padding = "0 22px"
    card.style.borderRight = "0"
    card.style.borderBottom = "1px solid #edf0f4"
    card.style.borderRadius = "0"
    card.style.background = "#ffffff"
    card.style.display = card.hidden ? "none" : "grid"
    card.style.gridTemplateColumns = "22px 34px minmax(0, 1fr)"
    card.style.alignItems = "center"
    card.style.gap = "15px"
    card.style.textAlign = "left"

    checkbox.style.width = "17px"
    checkbox.style.height = "17px"
    checkbox.style.border = "1px solid #d6dce5"
    checkbox.style.borderRadius = "5px"
    checkbox.style.background = "#ffffff"
    checkbox.style.display = "block"

    const avatar = card.querySelector(".go-mini-conversation-card__avatar")
    const content = card.querySelector(".go-mini-conversation-card__content")
    const meta = card.querySelector(".go-mini-conversation-card__meta")
    const channel = card.querySelector(".go-mini-conversation-card__meta span")
    const time = card.querySelector(".go-mini-conversation-card__meta small")
    const name = card.querySelector("strong")
    const message = card.querySelector("p")
    const tags = card.querySelector(".go-mini-conversation-card__tags")

    if (avatar) {
      avatar.style.width = "30px"
      avatar.style.height = "30px"
      avatar.style.margin = "0"
      avatar.style.borderRadius = "8px"
      avatar.style.fontSize = "0.68rem"
      avatar.style.alignSelf = "center"
    }

    if (content) {
      content.style.minWidth = "0"
      content.style.width = "100%"
      content.style.display = "grid"
      content.style.gridTemplateColumns = "160px 140px minmax(0, 1fr) 82px"
      content.style.alignItems = "center"
      content.style.gap = "18px"
    }

    if (meta) {
      meta.style.display = "contents"
      meta.style.margin = "0"
    }

    if (channel) {
      channel.style.gridColumn = "1"
      channel.style.minWidth = "0"
      channel.style.color = "#5f6b7a"
      channel.style.display = "inline-flex"
      channel.style.alignItems = "center"
      channel.style.gap = "7px"
      channel.style.fontSize = "0.82rem"
      channel.style.fontWeight = "500"
      channel.style.whiteSpace = "nowrap"
      channel.style.overflow = "hidden"
      channel.style.textOverflow = "ellipsis"
    }

    if (name) {
      name.style.gridColumn = "2"
      name.style.minWidth = "0"
      name.style.display = "block"
      name.style.color = "#1f2937"
      name.style.fontSize = "0.86rem"
      name.style.fontWeight = "800"
      name.style.whiteSpace = "nowrap"
      name.style.overflow = "hidden"
      name.style.textOverflow = "ellipsis"
    }

    if (message) {
      message.style.gridColumn = "3"
      message.style.minWidth = "0"
      message.style.margin = "0"
      message.style.color = "#5f6b7a"
      message.style.fontSize = "0.86rem"
      message.style.lineHeight = "1.35"
      message.style.whiteSpace = "nowrap"
      message.style.overflow = "hidden"
      message.style.textOverflow = "ellipsis"
    }

    if (time) {
      time.style.gridColumn = "4"
      time.style.justifySelf = "end"
      time.style.color = "#5f6b7a"
      time.style.fontSize = "0.82rem"
      time.style.fontWeight = "700"
      time.style.whiteSpace = "nowrap"
    }

    if (tags) {
      tags.style.display = "none"
    }
  }

  resetExpandedCardLayout(card) {
    const checkbox = card.querySelector(".go-mini-expanded-check")

    if (checkbox) {
      checkbox.remove()
    }

    card.style.position = ""
    card.style.width = ""
    card.style.maxWidth = ""
    card.style.minWidth = ""
    card.style.minHeight = ""
    card.style.padding = ""
    card.style.borderRight = ""
    card.style.borderBottom = ""
    card.style.borderRadius = ""
    card.style.background = ""
    card.style.display = ""
    card.style.gridTemplateColumns = ""
    card.style.alignItems = ""
    card.style.gap = ""
    card.style.textAlign = ""

    const avatar = card.querySelector(".go-mini-conversation-card__avatar")
    const content = card.querySelector(".go-mini-conversation-card__content")
    const meta = card.querySelector(".go-mini-conversation-card__meta")
    const channel = card.querySelector(".go-mini-conversation-card__meta span")
    const time = card.querySelector(".go-mini-conversation-card__meta small")
    const name = card.querySelector("strong")
    const message = card.querySelector("p")
    const tags = card.querySelector(".go-mini-conversation-card__tags")

    if (avatar) avatar.removeAttribute("style")
    if (content) content.removeAttribute("style")
    if (meta) meta.removeAttribute("style")
    if (channel) channel.removeAttribute("style")
    if (time) time.removeAttribute("style")
    if (name) name.removeAttribute("style")
    if (message) message.removeAttribute("style")
    if (tags) tags.removeAttribute("style")
  }

  syncNotificationToggleIcon() {
    if (!this.notificationToggleButton) return

    const icon = this.notificationToggleButton.querySelector("i")

    if (icon) {
      icon.className = this.notificationsExpanded ? "fa-solid fa-arrow-left" : "fa-solid fa-arrow-right"
    }

    this.notificationToggleButton.setAttribute(
      "aria-label",
      this.notificationsExpanded ? "Voltar para visualização normal" : "Ir para próxima conversa"
    )
  }

  applySidebarFilter(event) {
    const label = event.detail.label

    this.currentConfig = this.filterConfig(label)
    this.currentFilter = this.currentConfig.filter
    this.activeTab = this.currentConfig.defaultTab

    this.setNotificationExpansion(false)
    this.closeConversation()
    this.applyCurrentView()
  }

  switchTab(event) {
    this.activeTab = event.currentTarget.dataset.conversationsTab

    this.closeConversation()
    this.applyCurrentView()
  }

  applyCurrentView() {
    this.updateTitle()
    this.updateTabCounts()
    this.updateActiveTab()
    this.updateConversationCards()
    this.updateEmptyState()
  }

  updateTitle() {
    this.screenTitleTarget.textContent = this.currentConfig.title
  }

  updateTabCounts() {
    this.tabTargets.forEach((tab) => {
      const tabName = tab.dataset.conversationsTab
      const count = this.currentConfig.counts[tabName] || 0
      const badge = tab.querySelector("span")

      if (badge) {
        badge.textContent = count
      }
    })
  }

  updateActiveTab() {
    this.tabTargets.forEach((tab) => {
      tab.classList.toggle("is-active", tab.dataset.conversationsTab === this.activeTab)
    })
  }

  updateConversationCards() {
    this.conversationCardTargets.forEach((card) => {
      const groups = card.dataset.conversationGroups.split(" ")
      const filters = card.dataset.conversationFilters.split(" ")

      const matchesTab = groups.includes(this.activeTab)
      const matchesFilter = filters.includes(this.currentFilter)

      card.hidden = !(matchesTab && matchesFilter)
      card.classList.remove("is-active")
    })

    const visibleCards = this.visibleConversationCards()

    this.listEmptyTarget.hidden = visibleCards.length > 0
    this.loadedMessageTarget.hidden = visibleCards.length === 0

    if (this.notificationsExpanded) {
      this.applyNotificationExpansionLayout()
    }
  }

  updateEmptyState() {
    const visibleCards = this.visibleConversationCards()

    if (visibleCards.length > 0) {
      this.emptyTitleTarget.textContent = "Por favor, selecione uma conversa no painel da esquerda"
      return
    }

    this.emptyTitleTarget.textContent = this.currentConfig.emptyMessage
  }

  openConversation(event) {
    const card = event.currentTarget

    this.setNotificationExpansion(false)

    this.conversationCardTargets.forEach((conversationCard) => {
      conversationCard.classList.toggle("is-active", conversationCard === card)
    })

    this.element.classList.add("has-conversation")
    this.element.classList.remove("is-details-closed")

    this.emptyPanelTarget.hidden = true
    this.chatPanelTarget.hidden = false
    this.detailsPanelTarget.hidden = false

    this.chatAvatarTarget.textContent = card.dataset.contactInitials
    this.chatNameTarget.textContent = card.dataset.contactName
    this.chatMetaTarget.textContent = `${card.dataset.contactId} • ${card.dataset.contactChannel}`

    this.detailsAvatarTarget.textContent = card.dataset.contactInitials
    this.detailsNameTarget.textContent = card.dataset.contactName
    this.detailsEmailTarget.textContent = card.dataset.contactEmail
    this.detailsPhoneTarget.textContent = card.dataset.contactPhone
    this.detailsHandleTarget.textContent = card.dataset.contactHandle
    this.detailsStatusTarget.textContent = card.dataset.contactStatus

    this.renderMessages(card.dataset.conversationKey)

    this.replyBoxTarget.textContent = "Shift + enter para nova linha. Digite '/' para selecionar uma Resposta Pronta."
    this.replyBoxTarget.classList.remove("has-content")
  }

  closeConversation() {
    this.element.classList.remove("has-conversation")
    this.element.classList.remove("is-details-closed")

    this.emptyPanelTarget.hidden = false
    this.chatPanelTarget.hidden = true
    this.detailsPanelTarget.hidden = true

    this.conversationCardTargets.forEach((card) => {
      card.classList.remove("is-active")
    })
  }

  closeDetails() {
    this.detailsPanelTarget.hidden = true
    this.element.classList.add("is-details-closed")
  }

  toggleResolveMenu(event) {
    event.stopPropagation()

    this.resolveMenuTarget.hidden = !this.resolveMenuTarget.hidden
    this.resolveButtonTarget.classList.toggle("is-active", !this.resolveMenuTarget.hidden)
  }

  selectResolve(event) {
    event.stopPropagation()

    this.resolveButtonTarget.innerHTML = "Resolvida <i class=\"fa-solid fa-angle-down\"></i>"
    this.resolveMenuTarget.hidden = true
    this.resolveButtonTarget.classList.remove("is-active")
  }

  selectPending(event) {
    event.stopPropagation()

    this.resolveButtonTarget.innerHTML = "Resolver <i class=\"fa-solid fa-angle-down\"></i>"
    this.resolveMenuTarget.hidden = true
    this.resolveButtonTarget.classList.remove("is-active")
  }

  sendReply() {
    const message = this.replyBoxTarget.innerText.trim()

    if (!message || message.includes("Shift + enter")) return

    const bubble = document.createElement("div")
    bubble.classList.add("go-mini-chat-message", "is-agent")
    bubble.innerHTML = `
      <p>${this.escapeHTML(message)}</p>
      <small>agora ✓</small>
    `

    this.messagesTarget.appendChild(bubble)

    this.replyBoxTarget.textContent = "Shift + enter para nova linha. Digite '/' para selecionar uma Resposta Pronta."
    this.replyBoxTarget.classList.remove("has-content")

    this.messagesTarget.scrollTop = this.messagesTarget.scrollHeight
  }

  openQuickConversation(event) {
    event.stopPropagation()

    this.setNotificationExpansion(false)
    this.closeFilterPanel()
    this.closeSortPanel()
    this.closeAllDropdowns()

    this.quickModalTarget.hidden = false
  }

  closeQuickConversation(event) {
    if (event) event.stopPropagation()

    if (!this.hasQuickModalTarget) return

    this.quickModalTarget.hidden = true
  }

  startQuickConversation(event) {
    event.stopPropagation()

    this.quickModalTarget.hidden = true
  }

  toggleFilterPanel(event) {
    event.stopPropagation()

    const willOpen = this.filterPanelTarget.hidden

    this.setNotificationExpansion(false)
    this.closeQuickConversation()
    this.closeSortPanel()
    this.closeAllDropdowns()

    this.filterPanelTarget.hidden = !willOpen
  }

  closeFilterPanel() {
    if (!this.hasFilterPanelTarget) return

    this.filterPanelTarget.hidden = true
  }

  toggleSortPanel(event) {
    event.stopPropagation()

    const willOpen = this.sortPanelTarget.hidden

    this.setNotificationExpansion(false)
    this.closeQuickConversation()
    this.closeFilterPanel()
    this.closeAllDropdowns()

    this.sortPanelTarget.hidden = !willOpen
  }

  closeSortPanel() {
    if (!this.hasSortPanelTarget) return

    this.sortPanelTarget.hidden = true
  }

  toggleFilterMenu(event) {
    event.stopPropagation()

    const button = event.currentTarget
    const type = button.dataset.filterMenuButton
    const row = button.closest(".go-mini-conversation-filter-row")
    const menu = row.querySelector(`[data-filter-menu="${type}"]`)

    const willOpen = menu.hidden

    this.closeFilterDropdowns(menu)
    this.closeSortDropdowns()

    menu.hidden = !willOpen
    button.classList.toggle("is-active", willOpen)
  }

  selectFilterOption(event) {
    event.stopPropagation()

    const option = event.currentTarget
    const type = option.dataset.filterType
    const label = option.dataset.filterLabelValue
    const row = option.closest(".go-mini-conversation-filter-row")
    const labelElement = row.querySelector(`[data-filter-label="${type}"]`)

    if (labelElement) {
      labelElement.textContent = label
    }

    if (type === "field") {
      const valueLabel = row.querySelector('[data-filter-label="value"]')

      if (valueLabel && label !== "Status") {
        valueLabel.textContent = "Selecione uma opção..."
      }

      if (valueLabel && label === "Status") {
        valueLabel.textContent = "Abertas"
      }
    }

    this.closeFilterDropdowns()
  }

  addFilterRow(event) {
    event.stopPropagation()

    const extraRow = this.filterPanelTarget.querySelector(".go-mini-conversation-filter-row--extra")

    if (!extraRow) return

    extraRow.hidden = false
  }

  removeExtraFilterRow(event) {
    event.stopPropagation()

    const row = event.currentTarget.closest(".go-mini-conversation-filter-row")

    row.hidden = true
    this.resetRow(row)
  }

  resetFilterRow(event) {
    event.stopPropagation()

    const row = event.currentTarget.closest(".go-mini-conversation-filter-row")

    this.resetRow(row)
  }

  clearFilters(event) {
    event.stopPropagation()

    this.filterPanelTarget.querySelectorAll(".go-mini-conversation-filter-row").forEach((row) => {
      this.resetRow(row)

      if (row.classList.contains("go-mini-conversation-filter-row--extra")) {
        row.hidden = true
      }
    })
  }

  applyFilters(event) {
    event.stopPropagation()

    this.closeFilterPanel()
    this.closeAllDropdowns()
  }

  resetRow(row) {
    const fieldLabel = row.querySelector('[data-filter-label="field"]')
    const operatorLabel = row.querySelector('[data-filter-label="operator"]')
    const valueLabel = row.querySelector('[data-filter-label="value"]')

    if (fieldLabel) fieldLabel.textContent = "Status"
    if (operatorLabel) operatorLabel.textContent = "Igual a"

    if (valueLabel) {
      valueLabel.textContent = row.classList.contains("go-mini-conversation-filter-row--extra")
        ? "Selecione uma opção..."
        : "Abertas"
    }

    row.querySelectorAll("[data-filter-menu]").forEach((menu) => {
      menu.hidden = true
    })

    row.querySelectorAll("[data-filter-menu-button]").forEach((button) => {
      button.classList.remove("is-active")
    })
  }

  toggleSortMenu(event) {
    event.stopPropagation()

    const button = event.currentTarget
    const type = button.dataset.sortMenuButton
    const menu = this.sortPanelTarget.querySelector(`[data-sort-menu="${type}"]`)
    const willOpen = menu.hidden

    this.closeSortDropdowns(menu)
    this.closeFilterDropdowns()

    menu.hidden = !willOpen
    button.classList.toggle("is-active", willOpen)
  }

  selectSortOption(event) {
    event.stopPropagation()

    const option = event.currentTarget
    const type = option.dataset.sortType
    const label = option.dataset.sortLabelValue
    const labelElement = this.sortPanelTarget.querySelector(`[data-sort-label="${type}"]`)

    if (labelElement) {
      labelElement.textContent = label
    }

    this.closeSortDropdowns()
  }

  closeFloatingOnOutside(event) {
    const clickedInsideQuickModal = event.target.closest(".go-mini-quick-modal")
    const clickedQuickButton = event.target.closest(".go-mini-conversations-title button")
    const clickedInsideFilterPanel = event.target.closest(".go-mini-conversation-filter-panel")
    const clickedFilterButton = event.target.closest(".go-mini-conversations-filter-button")
    const clickedInsideSort = event.target.closest(".go-mini-conversations-sort-wrap")

    if (!clickedInsideQuickModal && !clickedQuickButton && this.hasQuickModalTarget) {
      this.quickModalTarget.hidden = true
    }

    if (!clickedInsideFilterPanel && !clickedFilterButton) {
      this.closeFilterDropdowns()
    }

    if (!clickedInsideSort) {
      this.closeSortDropdowns()
    }
  }

  closeAllFloatingMenus() {
    this.closeQuickConversation()
    this.closeFilterPanel()
    this.closeSortPanel()
    this.closeAllDropdowns()
  }

  closeAllDropdowns() {
    this.closeFilterDropdowns()
    this.closeSortDropdowns()
  }

  closeFilterDropdowns(exceptMenu = null) {
    this.element.querySelectorAll("[data-filter-menu]").forEach((menu) => {
      if (menu !== exceptMenu) {
        menu.hidden = true
      }
    })

    this.element.querySelectorAll("[data-filter-menu-button]").forEach((button) => {
      const type = button.dataset.filterMenuButton
      const row = button.closest(".go-mini-conversation-filter-row")
      const menu = row ? row.querySelector(`[data-filter-menu="${type}"]`) : null

      button.classList.toggle("is-active", menu && menu.hidden === false)
    })
  }

  closeSortDropdowns(exceptMenu = null) {
    this.element.querySelectorAll("[data-sort-menu]").forEach((menu) => {
      if (menu !== exceptMenu) {
        menu.hidden = true
      }
    })

    this.element.querySelectorAll("[data-sort-menu-button]").forEach((button) => {
      const type = button.dataset.sortMenuButton
      const menu = this.element.querySelector(`[data-sort-menu="${type}"]`)

      button.classList.toggle("is-active", menu && menu.hidden === false)
    })
  }

  renderMessages(key) {
    const messages = {
      ana: `
        <div class="go-mini-chat-date">Hoje, 11:42</div>

        <div class="go-mini-chat-message is-client">
          <p>Olá, gostaria de entender os planos e integrações do GO ATendi.</p>
        </div>

        <div class="go-mini-chat-message is-agent">
          <p>Perfeito! Posso te ajudar com isso.</p>
          <small>11:44 ✓</small>
        </div>

        <div class="go-mini-chat-message is-agent">
          <p>Trabalhamos com canais oficiais da Meta, automações, CRM, Kanban e módulos de atendimento para organizar sua operação.</p>
          <small>11:45 ✓</small>
        </div>

        <div class="go-mini-chat-message is-client">
          <p>Ótimo, quero marcar uma apresentação.</p>
        </div>

        <div class="go-mini-chat-message is-success">
          <p>Agendei uma demonstração para quinta-feira às 14h30. Posso enviar os detalhes?</p>
          <small>11:47 ✓</small>
        </div>
      `,

      ricardo: `
        <div class="go-mini-chat-date">Hoje, 14:10</div>

        <div class="go-mini-chat-message is-client">
          <p>Preciso automatizar o primeiro atendimento da minha clínica.</p>
        </div>

        <div class="go-mini-chat-message is-agent">
          <p>Claro! O GO ATendi pode receber o contato, identificar o interesse, coletar dados importantes e encaminhar para o time certo.</p>
          <small>14:12 ✓</small>
        </div>

        <div class="go-mini-chat-message is-client">
          <p>Também consigo acompanhar esses contatos depois?</p>
        </div>

        <div class="go-mini-chat-message is-agent">
          <p>Sim. Você pode acompanhar no CRM e no Kanban, mantendo histórico, etiquetas e responsáveis por cada conversa.</p>
          <small>14:14 ✓</small>
        </div>
      `
    }

    this.messagesTarget.innerHTML = messages[key] || messages.ana
    this.messagesTarget.scrollTop = this.messagesTarget.scrollHeight
  }

  visibleConversationCards() {
    return this.conversationCardTargets.filter((card) => {
      return card.hidden === false
    })
  }

  filterConfig(label) {
    const configs = {
      "Todas as conversas": {
        title: "Conversas",
        filter: "all",
        defaultTab: "mine",
        counts: { mine: 0, unassigned: 2, all: 2 },
        emptyMessage: "Oh oh! parece que não há mensagens de clientes na sua caixa de entrada."
      },

      "Menções": {
        title: "Menções",
        filter: "mentions",
        defaultTab: "mine",
        counts: { mine: 0, unassigned: 0, all: 0 },
        emptyMessage: "Não há conversas ativas neste grupo."
      },

      "Participantes": {
        title: "Participantes",
        filter: "participants",
        defaultTab: "mine",
        counts: { mine: 0, unassigned: 0, all: 0 },
        emptyMessage: "Não há conversas ativas neste grupo."
      },

      "Não atendidas": {
        title: "Não atendidas",
        filter: "unanswered",
        defaultTab: "unassigned",
        counts: { mine: 0, unassigned: 2, all: 2 },
        emptyMessage: "Não há conversas ativas neste grupo."
      },

      "Suporte": {
        title: "Suporte",
        filter: "team-support",
        defaultTab: "unassigned",
        counts: { mine: 0, unassigned: 1, all: 1 },
        emptyMessage: "Não há conversas ativas neste grupo."
      },

      "Vendas": {
        title: "Vendas",
        filter: "team-sales",
        defaultTab: "unassigned",
        counts: { mine: 0, unassigned: 1, all: 1 },
        emptyMessage: "Não há conversas ativas neste grupo."
      },

      "Instagram": {
        title: "Instagram",
        filter: "channel-instagram",
        defaultTab: "unassigned",
        counts: { mine: 0, unassigned: 1, all: 1 },
        emptyMessage: "Não há conversas ativas neste grupo."
      },

      "Messenger": {
        title: "Messenger",
        filter: "channel-messenger",
        defaultTab: "mine",
        counts: { mine: 0, unassigned: 0, all: 0 },
        emptyMessage: "Não há conversas ativas neste grupo."
      },

      "Facebook": {
        title: "Facebook",
        filter: "channel-facebook",
        defaultTab: "mine",
        counts: { mine: 0, unassigned: 0, all: 0 },
        emptyMessage: "Não há conversas ativas neste grupo."
      },

      "WhatsApp Oficial": {
        title: "WhatsApp Oficial",
        filter: "channel-whatsapp",
        defaultTab: "unassigned",
        counts: { mine: 0, unassigned: 1, all: 1 },
        emptyMessage: "Não há conversas ativas neste grupo."
      },

      "Site": {
        title: "Site",
        filter: "channel-site",
        defaultTab: "mine",
        counts: { mine: 0, unassigned: 0, all: 0 },
        emptyMessage: "Não há conversas ativas neste grupo."
      },

      "lead-desqualificado": {
        title: "lead-desqualificado",
        filter: "tag-disqualified",
        defaultTab: "mine",
        counts: { mine: 0, unassigned: 0, all: 0 },
        emptyMessage: "Não há conversas ativas neste grupo."
      },

      "lead-frio": {
        title: "lead-frio",
        filter: "tag-cold",
        defaultTab: "unassigned",
        counts: { mine: 0, unassigned: 1, all: 1 },
        emptyMessage: "Não há conversas ativas neste grupo."
      },

      "lead-quente": {
        title: "lead-quente",
        filter: "tag-hot",
        defaultTab: "unassigned",
        counts: { mine: 0, unassigned: 1, all: 1 },
        emptyMessage: "Não há conversas ativas neste grupo."
      }
    }

    return configs[label] || configs["Todas as conversas"]
  }

  escapeHTML(value) {
    return value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;")
  }
}
