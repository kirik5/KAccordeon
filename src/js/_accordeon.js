export default class Accordeon {
    constructor({
        accordeonContainer,
        accordeonContentClass,
        singleMode = false
    }) {
        this._container = document.querySelector(accordeonContainer)
        this._contents = document.querySelectorAll(accordeonContentClass)
        this._singleMode = singleMode
        this._hideContentStart()
        this._addTransformIconClass()
        this._optimizedResize()

        this._container.addEventListener('click', this._clickTitleHandler)
        window.addEventListener('optimizedResize', this._chagneScreenWidthHandler)
    }

    _hideContentStart = () => {
        const contentsArray = Array.from(this._contents)
        contentsArray.forEach((content, key) => {
            content.classList.add('accordeon__content_animTarget')

            if (!content.parentElement.hasAttribute('data-opened')) return

            if (this._singleMode) {
                if (key === 0) {
                    content.style.maxHeight = content.scrollHeight + 'px'
                } else {
                    content.parentElement.removeAttribute('data-opened')
                }
            } else {
                content.style.maxHeight = content.scrollHeight + 'px'
            }
        })
    }

    _addTransformIconClass = () => {
        for (let elem of this._contents) {
            const icon = elem.previousElementSibling.lastElementChild
            icon.classList.add('accordeon__titleIcon_transform')
        }
    }

    _showContent = (content) => {
        if (this._singleMode) {
            const contentWillHide = this._container.querySelector('[data-opened]')

            if (contentWillHide) {
                this._hideContent(contentWillHide.lastElementChild)
            }
        }

        content.style.maxHeight = content.scrollHeight + 'px'
        content.parentElement.setAttribute('data-opened', '')
        content.classList.remove('accordeonaccordeon__content_animTarget')
    }

    _hideContent = (content) => {
        content.parentElement.removeAttribute('data-opened')
        content.classList.add('accordeon__content_animTarget')
        content.style.maxHeight = ''
    }

    _clickTitleHandler = (evt) => {
        const title = evt.target.closest('.accordeon__title')
        if (!title) return

        const content = title.nextElementSibling

        if (!content.parentElement.hasAttribute('data-opened')) {
            this._showContent(content)
        } else {
            this._hideContent(content)
        }
    }

    _optimizedResize = () => {
        const throttle = function (type, name, obj) {
            obj = obj || window
            let running = false
            const func = function () {
                if (running) return
                running = true
                requestAnimationFrame(function () {
                    obj.dispatchEvent(new CustomEvent(name))
                    running = false
                })
            }
            obj.addEventListener(type, func)
        };

        throttle("resize", "optimizedResize")
    }

    _chagneScreenWidthHandler = () => {
        const activeContent = this._container.querySelectorAll('.accordeon__element[data-opened] .accordeon__content')
        for (let content of activeContent) {
            content.style.maxHeight = content.scrollHeight + 'px'
        }
    }

    destroy = () => {
        this._container.removeEventListener('click', this._clickTitleHandler)
        this.window.removeEventListener('optimizedResize', this._chagneScreenWidthHandler)
    }
}