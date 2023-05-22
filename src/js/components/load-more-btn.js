export default class LoadMoreBtn {
    static classes = {
        hidden: "hidden",
      };
    constructor({ selector, isHidden = false }) {
      this.btnRefs = this.getBtnRefs(selector),
  
      isHidden && this.hide();
    }
  
    getBtnRefs(selector) {
      const btnRefs = {};
      btnRefs.button = document.querySelector(selector);
    //   btnRefs.button = document.querySelector('.load-more');
      btnRefs.label = btnRefs.button.querySelector('.label');
      btnRefs.spinner = btnRefs.button.querySelector('.spinner');
  
      return btnRefs;
    }
  
    enable() {
      this.btnRefs.button.disabled = false;
      this.btnRefs.label.textContent = 'Load more';
      this.btnRefs.spinner.classList.add('is-hidden');
    }
  
    disable() {
      this.btnRefs.button.disabled = true;
      this.btnRefs.label.textContent = 'Loading...';
      this.btnRefs.spinner.classList.remove('is-hidden');
    }
  
    show() {
      this.btnRefs.button.classList.remove('is-hidden');
    }
  
    hide() {
      this.btnRefs.button.classList.add('is-hidden');
    }
  }