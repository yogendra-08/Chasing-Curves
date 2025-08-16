class DialogSystem {
    constructor() {
        this.dialogElement = document.getElementById('dialog-box');
        this.dialogText = document.getElementById('dialog-text');
        this.dialogOptions = document.getElementById('dialog-options');
        this.nextButton = document.getElementById('next-dialog');
        this.currentDialog = null;
        this.currentIndex = 0;
        this.onComplete = null;

        // Set up event listeners
        this.nextButton.addEventListener('click', () => this.next());
    }

    show(text, options = []) {
        this.currentDialog = Array.isArray(text) ? text : [{ text, options }];
        this.currentIndex = 0;
        this.dialogElement.classList.remove('hidden');
        this.dialogElement.classList.add('pointer-events-auto');
        this.showCurrentDialog();
    }

    showCurrentDialog() {
        if (!this.currentDialog || this.currentIndex >= this.currentDialog.length) {
            this.hide();
            return;
        }

        const dialog = this.currentDialog[this.currentIndex];
        this.dialogText.textContent = dialog.text;
        
        // Clear previous options
        this.dialogOptions.innerHTML = '';
        
        // Add new options if they exist
        if (dialog.options && dialog.options.length > 0) {
            dialog.options.forEach((option, index) => {
                const button = document.createElement('button');
                button.className = 'bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded mr-2 mb-2';
                button.textContent = option.text;
                button.addEventListener('click', () => {
                    if (option.action) option.action();
                    this.next();
                });
                this.dialogOptions.appendChild(button);
            });
            this.nextButton.classList.add('hidden');
        } else {
            this.nextButton.classList.remove('hidden');
        }
    }

    next() {
        this.currentIndex++;
        if (this.currentIndex < this.currentDialog.length) {
            this.showCurrentDialog();
        } else {
            this.hide();
            if (this.onComplete) {
                this.onComplete();
                this.onComplete = null;
            }
        }
    }

    hide() {
        this.dialogElement.classList.add('hidden');
        this.dialogElement.classList.remove('pointer-events-auto');
        this.currentDialog = null;
        this.currentIndex = 0;
    }

    onComplete(callback) {
        this.onComplete = callback;
    }
}

export { DialogSystem };
