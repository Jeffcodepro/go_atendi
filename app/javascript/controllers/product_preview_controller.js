import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = [
    "menuItem",
    "submenu",
    "submenuItem",
    "screen"
  ]

  connect() {
    this.activeModule = "inbox"
    this.activateModule("inbox")
  }

  switchModule(event) {
    const moduleName = event.currentTarget.dataset.previewModule
    const hasSubmenu = this.hasSubmenuFor(moduleName)
    const sameModule = this.activeModule === moduleName
    const submenu = this.getSubmenu(moduleName)
    const submenuIsVisible = submenu && submenu.hidden === false
    const submenuIsCollapsed = submenu && submenu.classList.contains("is-collapsed")

    this.activeModule = moduleName

    this.activateMenuItem(moduleName)
    this.activateScreen(moduleName)

    if (!hasSubmenu) {
      this.closeAllSubmenus()
      this.clearAllSubmenuSelections()
      this.syncCaretState()
      return
    }

    if (sameModule && submenuIsVisible && !submenuIsCollapsed) {
      this.collapseSubmenuKeepingCurrent(moduleName)
      this.dispatchConversationFilterIfNeeded(moduleName)
      this.syncCaretState()
      return
    }

    if (sameModule && submenuIsVisible && submenuIsCollapsed) {
      this.openOnlySubmenu(moduleName)
      this.ensureSubmenuHasCurrentItem(moduleName)
      this.dispatchConversationFilterIfNeeded(moduleName)
      this.syncCaretState()
      return
    }

    this.clearSubmenuSelectionsExcept(moduleName)
    this.openOnlySubmenu(moduleName)
    this.ensureSubmenuHasCurrentItem(moduleName)
    this.dispatchConversationFilterIfNeeded(moduleName)
    this.syncCaretState()
  }

  switchSubmenu(event) {
    event.stopPropagation()

    const submenuItem = event.currentTarget
    const moduleName = submenuItem.dataset.submenuParent

    this.activeModule = moduleName

    this.clearSubmenuSelectionsExcept(moduleName)
    this.activateMenuItem(moduleName)
    this.activateScreen(moduleName)
    this.openOnlySubmenu(moduleName)
    this.activateSubmenuItem(submenuItem)
    this.dispatchConversationSelection(submenuItem)
    this.syncCaretState()
  }

  activateModule(moduleName) {
    const hasSubmenu = this.hasSubmenuFor(moduleName)

    this.activeModule = moduleName

    this.activateMenuItem(moduleName)
    this.activateScreen(moduleName)

    if (hasSubmenu) {
      this.openOnlySubmenu(moduleName)
      this.ensureSubmenuHasCurrentItem(moduleName)
      this.dispatchConversationFilterIfNeeded(moduleName)
    } else {
      this.closeAllSubmenus()
      this.clearAllSubmenuSelections()
    }

    this.syncCaretState()
  }

  activateMenuItem(moduleName) {
    this.menuItemTargets.forEach((item) => {
      const active = item.dataset.previewModule === moduleName
      item.classList.toggle("is-active", active)
    })
  }

  activateScreen(moduleName) {
    this.screenTargets.forEach((screen) => {
      const active = screen.dataset.previewScreen === moduleName

      screen.hidden = !active
      screen.classList.toggle("is-active", active)
    })
  }

  activateSubmenuItem(selectedItem) {
    const moduleName = selectedItem.dataset.submenuParent

    this.submenuItemTargets.forEach((item) => {
      const sameSubmenu = item.dataset.submenuParent === moduleName
      const active = sameSubmenu && item === selectedItem

      item.classList.toggle("is-current", active)
    })
  }

  ensureSubmenuHasCurrentItem(moduleName) {
    const currentItem = this.getCurrentSubmenuItem(moduleName)

    if (currentItem) return currentItem

    const firstItem = this.getFirstSubmenuItem(moduleName)

    if (firstItem) {
      firstItem.classList.add("is-current")
      return firstItem
    }

    return null
  }

  openOnlySubmenu(moduleName) {
    this.submenuTargets.forEach((submenu) => {
      const shouldOpen = submenu.dataset.parentModule === moduleName

      if (shouldOpen) {
        submenu.hidden = false
        submenu.classList.add("is-open")
        submenu.classList.remove("is-collapsed")
        this.showFullSubmenu(submenu)
      } else {
        submenu.hidden = true
        submenu.classList.remove("is-open")
        submenu.classList.remove("is-collapsed")
        this.showFullSubmenu(submenu)
      }
    })
  }

  collapseSubmenuKeepingCurrent(moduleName) {
    const submenu = this.getSubmenu(moduleName)

    if (!submenu) return

    let currentItem = this.getCurrentSubmenuItem(moduleName)

    if (!currentItem) {
      currentItem = this.getFirstSubmenuItem(moduleName)
    }

    if (!currentItem) {
      submenu.hidden = true
      submenu.classList.remove("is-open")
      submenu.classList.remove("is-collapsed")
      return
    }

    currentItem.classList.add("is-current")

    submenu.hidden = false
    submenu.classList.add("is-open")
    submenu.classList.add("is-collapsed")

    this.hideSubmenuItemsExceptCurrent(submenu, currentItem)
  }

  closeAllSubmenus() {
    this.submenuTargets.forEach((submenu) => {
      submenu.hidden = true
      submenu.classList.remove("is-open")
      submenu.classList.remove("is-collapsed")
      this.showFullSubmenu(submenu)
    })
  }

  clearAllSubmenuSelections() {
    this.submenuItemTargets.forEach((item) => {
      item.classList.remove("is-current")
    })
  }

  clearSubmenuSelectionsExcept(moduleName) {
    this.submenuItemTargets.forEach((item) => {
      const sameSubmenu = item.dataset.submenuParent === moduleName

      if (!sameSubmenu) {
        item.classList.remove("is-current")
      }
    })
  }

  showFullSubmenu(submenu) {
    submenu
      .querySelectorAll(".go-mini-submenu__group, .go-mini-submenu__title, .go-mini-submenu__item")
      .forEach((element) => {
        element.hidden = false
      })
  }

  hideSubmenuItemsExceptCurrent(submenu, currentItem) {
    submenu.querySelectorAll(".go-mini-submenu__item").forEach((item) => {
      item.hidden = item !== currentItem
    })

    submenu.querySelectorAll(".go-mini-submenu__title").forEach((title) => {
      title.hidden = true
    })

    submenu.querySelectorAll(".go-mini-submenu__group").forEach((group) => {
      group.hidden = !group.contains(currentItem)
    })
  }

  hasSubmenuFor(moduleName) {
    return this.submenuTargets.some((submenu) => {
      return submenu.dataset.parentModule === moduleName
    })
  }

  getSubmenu(moduleName) {
    return this.submenuTargets.find((submenu) => {
      return submenu.dataset.parentModule === moduleName
    })
  }

  getCurrentSubmenuItem(moduleName) {
    return this.submenuItemTargets.find((item) => {
      return item.dataset.submenuParent === moduleName && item.classList.contains("is-current")
    })
  }

  getFirstSubmenuItem(moduleName) {
    return this.submenuItemTargets.find((item) => {
      return item.dataset.submenuParent === moduleName
    })
  }

  isSubmenuExpanded(moduleName) {
    const submenu = this.getSubmenu(moduleName)

    if (!submenu) return false

    return (
      submenu.hidden === false &&
      submenu.classList.contains("is-open") &&
      !submenu.classList.contains("is-collapsed")
    )
  }

  syncCaretState() {
    this.menuItemTargets.forEach((item) => {
      const moduleName = item.dataset.previewModule
      const caret = item.querySelector(".go-mini-menu__caret")

      if (!caret) return

      caret.classList.toggle("is-open", this.isSubmenuExpanded(moduleName))
    })
  }

  dispatchConversationFilterIfNeeded(moduleName) {
    if (moduleName !== "conversations") return

    const selectedItem = this.ensureSubmenuHasCurrentItem("conversations")

    if (!selectedItem) return

    this.dispatchConversationSelection(selectedItem)
  }

  dispatchConversationSelection(submenuItem) {
    const moduleName = submenuItem.dataset.submenuParent

    if (moduleName !== "conversations") return

    const label = submenuItem.textContent.replace(/\s+/g, " ").trim()

    window.dispatchEvent(
      new CustomEvent("go-atendi:conversation-filter", {
        detail: { label }
      })
    )
  }
}
