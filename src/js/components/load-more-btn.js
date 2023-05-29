export default class LoadMoreBtn {
    static classes = {
        hidden: "hidden",
      };
    constructor({ selector, isHidden = true }) {
      this.button = this.getBtn(selector),
  
      isHidden && this.hide();
      this.button.textContent = 'Load more'
    }
  
    getBtn(selector) {
        return document.querySelector(selector);
    }
  
    show() {
      this.button.disabled = false;
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