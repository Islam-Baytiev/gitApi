const url = 'https://api.github.com/search/repositories';
class View {
  constructor() {
    this.inputSearch = document.querySelector('.input__search');
    this.inputList = document.querySelector('.input__list');
    this.result = document.querySelector('.result');
    this.result.addEventListener('click', (event) => {
      if (event.target.classList.contains('result__btn')) {
        event.target.parentElement.remove();
      }
      if (
          event.target.classList.contains('btn__span-left') ||
          event.target.classList.contains('btn__span-right')
      ) {
        event.target.parentElement.parentElement.remove();
        this.result.removeEventListener('click', event)
      }
    })


  }

  createElement(elementTag, elementClass) {
    const element = document.createElement(elementTag);
    if (elementClass) {
      element.classList.add(elementClass);
    }
    return element;
  }

  createUser(userData) {
    const user = this.createElement('li', 'list-input');
    user.innerHTML = `${userData.name}`;
    this.inputList.append(user);
    user.addEventListener('click', () => {
      this.resUser = this.createElement('li', 'user');
      this.blockTitle = this.createElement('div');
      this.blockTitle.innerHTML = `<p>Name: ${userData.name}</p> <p>Owner: ${userData.owner.login}</p> <p>Stars: ${userData.stargazers_count}</p>`;
      this.btn = this.createElement('button', 'result__btn');
      this.btnSpanLeft = this.createElement('span', 'btn__span-left');
      this.btnSpanRight = this.createElement('span', 'btn__span-right');
      this.btn.append(this.btnSpanRight);
      this.btn.append(this.btnSpanLeft);
      this.resUser.append(this.blockTitle);
      this.resUser.append(this.btn);
      this.result.append(this.resUser);
    })
  }
}


class Search  {
  constructor(View) {
    this.viev = View;
    this.viev.inputSearch.addEventListener('input', this.debounce(this.searchUsers.bind(this),550));
  }

  async searchUsers() {
    if (this.viev.inputSearch.value) {
      this.viev.inputList.innerHTML = '';
      return await fetch(`${url}?q=${this.viev.inputSearch.value}&per_page=5`).then(res => {
        if (res.ok) {
          res.json().then(res => {
            if (res.items.length) {
              res.items.forEach(user => {
                this.viev.createUser(user)
              })
            }
            else {
              this.viev.inputList.innerHTML = "Такого репозитория не существует"
            }
          })
        }
      })
    }
    else {
      this.clearUsers()
    }
  }

  clearUsers() {
    this.viev.inputList.innerHTML = '';
  }

  debounce(fn, ms) {
    let inDebounce;
    return function (...args) {
      return new Promise(res => {
        clearTimeout(inDebounce);
        inDebounce = setTimeout(() => res(fn.apply(this, args)), ms);
      });
    };
  }

}

new Search(new View())

