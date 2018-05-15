import { MkComponent } from '../MkComponent/MkComponent.js';

class Dialog extends MkComponent {
	init () {
		this.contentNode.id = this.node.id + 'Description';
		this.dialogNode.setAttribute('aria-describedby', this.contentNode.id);

		if (this.titleNode.innerHTML) {
			this.titleNode.classList.remove('hidden');
			this.titleNode.id = this.node.id + 'Title';
			this.dialogNode.setAttribute('aria-labelledby', this.titleNode.id);
		}
	}

	get closeable () {
		return this._closeable;
	}

	set closeable (newValue) {
		this._closeable = newValue;

		if (this._closeable) {
			this.closeButton.classList.remove('hidden');
		}
	}

	get title () {
		return this.titleNode.textContent;
	}

	set title (newTitle) {
		this.titleNode.innerHTML = newTitle;
	}

	registerEventHandlers () {
		this.node.addEventListener('click', this.handleOverlayClick.bind(this));
		this.closeButton.addEventListener('click', this.hide.bind(this));
	}

	handleOverlayClick (event) {
		if (this._closeable && event.target === this.node) {
			this.hide();
		}
	}

	show () {
		document.body.classList.add('no-scroll');
		this.node.style.display = 'flex';
	}

	hide () {
		document.body.classList.remove('no-scroll');
		this.node.style.display = 'none';
	}
}

export { Dialog };
