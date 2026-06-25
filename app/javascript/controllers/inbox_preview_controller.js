import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "displayButton",
    "displayMenu",
    "actionsButton",
    "actionsMenu",
    "orderButton",
    "orderMenu",
    "orderLabel",
    "checkOption",
    "listMessage",
    "emptyMessage"
  ]

  connect() {
    this.closeDisplayMenu()
    this.closeActionsMenu()
    this.closeOrderMenu()
  }

  toggleDisplayMenu(event) {
    event.stopPropagation()

    const willOpen = this.displayMenuTarget.hidden

    this.closeActionsMenu()
    this.closeOrderMenu()

    this.displayMenuTarget.hidden = !willOpen
    this.displayButtonTarget.classList.toggle("is-active", willOpen)
  }

  toggleActionsMenu(event) {
    event.stopPropagation()

    const willOpen = this.actionsMenuTarget.hidden

    this.closeDisplayMenu()
    this.closeOrderMenu()

    this.actionsMenuTarget.hidden = !willOpen
    this.actionsButtonTarget.classList.toggle("is-active", willOpen)
  }

  toggleOrderMenu(event) {
    event.stopPropagation()

    const willOpen = this.orderMenuTarget.hidden
    this.orderMenuTarget.hidden = !willOpen
    this.orderButtonTarget.classList.toggle("is-active", willOpen)
  }

  selectOrder(event) {
    event.stopPropagation()

    const selectedButton = event.currentTarget
    const label = selectedButton.dataset.orderLabel

    this.orderLabelTarget.textContent = label

    this.orderMenuTarget.querySelectorAll("button").forEach((button) => {
      button.classList.toggle("is-active", button === selectedButton)
    })

    this.closeOrderMenu()
  }

  toggleCheckOption(event) {
    event.stopPropagation()

    const option = event.currentTarget
    option.classList.toggle("is-checked")

    this.updateFilterFeedback()
  }

  markAllAsRead(event) {
    event.stopPropagation()

    this.listMessageTarget.textContent = "Nenhuma notificação não lida"
    this.emptyMessageTarget.textContent = "Todas as notificações foram marcadas como lidas"

    this.closeActionsMenu()
  }

  deleteAll(event) {
    event.stopPropagation()

    this.listMessageTarget.textContent = "Nenhuma notificação"
    this.emptyMessageTarget.textContent = "Todas as notificações foram excluídas"

    this.closeActionsMenu()
  }

  deleteRead(event) {
    event.stopPropagation()

    this.listMessageTarget.textContent = "Nenhuma notificação lida"
    this.emptyMessageTarget.textContent = "As notificações lidas foram excluídas"

    this.closeActionsMenu()
  }

  closeMenusOnOutside(event) {
    const clickedInsideDisplay = event.target.closest(".go-mini-inbox-display-wrap")
    const clickedInsideActions = event.target.closest(".go-mini-inbox-actions-wrap")

    if (!clickedInsideDisplay) {
      this.closeDisplayMenu()
    }

    if (!clickedInsideActions) {
      this.closeActionsMenu()
    }

    if (!clickedInsideDisplay) {
      this.closeOrderMenu()
    }
  }

  closeDisplayMenu() {
    if (!this.hasDisplayMenuTarget) return

    this.displayMenuTarget.hidden = true

    if (this.hasDisplayButtonTarget) {
      this.displayButtonTarget.classList.remove("is-active")
    }
  }

  closeActionsMenu() {
    if (!this.hasActionsMenuTarget) return

    this.actionsMenuTarget.hidden = true

    if (this.hasActionsButtonTarget) {
      this.actionsButtonTarget.classList.remove("is-active")
    }
  }

  closeOrderMenu() {
    if (!this.hasOrderMenuTarget) return

    this.orderMenuTarget.hidden = true

    if (this.hasOrderButtonTarget) {
      this.orderButtonTarget.classList.remove("is-active")
    }
  }

  updateFilterFeedback() {
    const checkedOptions = this.checkOptionTargets.filter((option) => {
      return option.classList.contains("is-checked")
    })

    if (checkedOptions.length === 0) {
      this.listMessageTarget.textContent = "Nenhuma notificação"
      this.emptyMessageTarget.textContent = "Notificações de todas as caixas inscritas"
      return
    }

    const labels = checkedOptions.map((option) => {
      return option.innerText.trim()
    })

    this.listMessageTarget.textContent = `Nenhuma notificação em: ${labels.join(", ")}`
    this.emptyMessageTarget.textContent = "Nenhuma notificação encontrada com os filtros aplicados"
  }
}
