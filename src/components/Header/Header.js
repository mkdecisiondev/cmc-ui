import { MkComponent } from '../MkComponent/MkComponent.js';
import { keys } from '../../util/keys.js';

class Header extends MkComponent {
	init () {
		this.isNavigatorOpen = false;
	}

	registerEventHandlers () {
		this.hamburgerNode.addEventListener('click', this.toggleNavigator.bind(this));
		window.addEventListener('hashchange', this.closeNavigator.bind(this));
		document.addEventListener('click', this.handleOutsideClick.bind(this));
		document.addEventListener('keydown', this.handleEscapeEvent.bind(this));
	}

	openNavigator () {
		this.isNavigatorOpen = true;
		this.node.classList.add('fixed');
		this.node.parentNode.classList.add('header-height-padding');
		this.verticalNavigatorNode.classList.add('open');
		this.hamburgerNode.classList.add('open');
		this.socialMediaNode.classList.add('open');
		this.hamburgerNode.setAttribute('aria-expanded', this.isNavigatorOpen);
	}

	closeNavigator () {
		this.isNavigatorOpen = false;
		this.node.classList.remove('fixed');
		this.node.parentNode.classList.remove('header-height-padding');
		this.verticalNavigatorNode.classList.remove('open');
		this.hamburgerNode.classList.remove('open');
		this.socialMediaNode.classList.remove('open');
		this.hamburgerNode.setAttribute('aria-expanded', this.isNavigatorOpen);
	}

	toggleNavigator () {
		if (this.isNavigatorOpen) {
			this.closeNavigator();
		}
		else {
			this.openNavigator();
		}
	}

	handleOutsideClick (event) {
		if (this.isNavigatorOpen && !this.node.contains(event.target)) {
			this.closeNavigator();
		}
	}

	handleEscapeEvent (event) {
		if (this.isNavigatorOpen && event.keyCode === keys.Escape) {
			this.closeNavigator();
		}
	}
}

export { Header };
