import View from './View.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');

      if (!btn) return;

      const goToPage = +btn.dataset.goto;

      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // Page 1, and there are other pages
    if (currPage === 1 && numPages > 1) {
      return this._generateMarkupButtonNext(currPage + 1);
    }

    // Last page
    if (currPage === numPages && numPages > 1) {
      return this._generateMarkupButtonPrev(currPage - 1);
    }

    // Other page
    if (currPage < numPages) {
      return this._generateMarkupButtonNext(currPage + 1).concat(
        this._generateMarkupButtonPrev(currPage - 1)
      );
    }

    // Page 1, and there are NO other pages
    return '';
  }

  _generateMarkupButtonNext(page) {
    return `
    <button data-goto="${page}" class="btn--inline pagination__btn--next">
      <span>Page ${page}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>`;
  }

  _generateMarkupButtonPrev(page) {
    return `
    <button data-goto="${page}" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${page}</span>
    </button>
    `;
  }
}

export default new PaginationView();
