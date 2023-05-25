export default class LoadMoreBtn {
    static classes = {
        hidden: "hidden",
      };
    constructor({ selector, isHidden = false }) {
      this.button = this.getBtn(selector),
  
      isHidden && this.hide();
    }
  
    getBtn(selector) {
        return document.querySelector(selector);
    }
  
    enable() {
      this.button.disabled = false;
      this.button.textContent = 'Load more';
    }
  
    disable() {
      this.button.disabled = true;
      this.button.textContent = 'Loading...';
    }
  
    show() {
      this.button.classList.remove('is-hidden');
    }
  
    hide() {
      this.button.classList.add('is-hidden');
    }

    end() {
        this.button.disabled = true;
        this.button.textContent = "The end!";
      }
  }