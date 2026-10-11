;;; init.el --- SpecDojo Dev Container Emacs defaults -*- lexical-binding: t; -*-

;;; Commentary:
;; A dependency-free starting point for terminal Emacs in a generated Dev Container.
;; Every section is intentionally independent so that users can change or remove it.

;;; Code:

;; Use UTF-8 for files, the terminal, and subprocess communication.
(set-language-environment "UTF-8")
(prefer-coding-system 'utf-8-unix)
(set-default-coding-systems 'utf-8-unix)
(set-terminal-coding-system 'utf-8-unix)
(set-keyboard-coding-system 'utf-8-unix)

;; Make C-h delete backward.  Help remains available on C-x ? and <f1>.
(global-set-key (kbd "C-h") #'delete-backward-char)
(global-set-key (kbd "C-x ?") help-map)

;; Show line numbers and highlight the parenthesis matching the one at point.
(global-display-line-numbers-mode 1)
(show-paren-mode 1)

;; Keep backup and auto-save data under ~/.local/share/emacs, outside the worktree.
(let ((backup-directory (expand-file-name "~/.local/share/emacs/backups/"))
      (auto-save-directory (expand-file-name "~/.local/share/emacs/auto-save/")))
  (unless noninteractive
    (make-directory backup-directory t)
    (make-directory auto-save-directory t))
  (setq backup-directory-alist `(("." . ,backup-directory))
        auto-save-file-name-transforms `((".*" ,auto-save-directory t))
        auto-save-list-file-prefix (expand-file-name ".saves-" auto-save-directory)))

;; Enable mouse reporting when Emacs is running in a terminal.
(when (and (not window-system) (fboundp 'xterm-mouse-mode))
  (xterm-mouse-mode 1))

;; Provide dependency-free major modes for file types whose richer modes normally need packages
;; or tree-sitter grammars.  These modes retain basic built-in editing and syntax support.
(define-derived-mode specdojo-typescript-mode js-mode "TypeScript"
  "Edit TypeScript using Emacs's built-in JavaScript syntax support.")
(define-derived-mode specdojo-markdown-mode text-mode "Markdown"
  "Edit Markdown using Emacs's built-in text editing support.")
(define-derived-mode specdojo-yaml-mode conf-mode "YAML"
  "Edit YAML using Emacs's built-in configuration-file support.")

;; Select the dependency-free modes for TypeScript, Markdown, and YAML files.
(add-to-list 'auto-mode-alist '("\\.tsx?\\'" . specdojo-typescript-mode))
(add-to-list 'auto-mode-alist '("\\.md\\'" . specdojo-markdown-mode))
(add-to-list 'auto-mode-alist '("\\.ya?ml\\'" . specdojo-yaml-mode))

;; Tell the built-in Eglot client which bundled language server belongs to each mode.
(with-eval-after-load 'eglot
  (add-to-list 'eglot-server-programs
               '((specdojo-typescript-mode :language-id "typescript")
                 . ("typescript-language-server" "--stdio")))
  (add-to-list 'eglot-server-programs
               '(specdojo-markdown-mode . ("marksman" "server")))
  (add-to-list 'eglot-server-programs
               '(specdojo-yaml-mode . ("yaml-language-server" "--stdio"))))

;; Start Eglot only when the matching server executable exists.  A startup failure is reported as
;; a message and leaves the buffer available for normal editing.
(defun specdojo-eglot-ensure-if-available ()
  "Start Eglot when the language server for the current buffer is installed."
  (let ((server (alist-get major-mode
                           '((specdojo-typescript-mode . "typescript-language-server")
                             (specdojo-markdown-mode . "marksman")
                             (specdojo-yaml-mode . "yaml-language-server")
                             (sh-mode . "bash-language-server")))))
    (when (and server (executable-find server))
      (condition-case error-data
          (progn
            (require 'eglot)
            (eglot-ensure))
        (error
         (message "SpecDojo: Eglot did not start: %s"
                  (error-message-string error-data)))))))

;; Connect supported TypeScript, Markdown, YAML, and shell buffers to their LSP servers.
(dolist (hook '(specdojo-typescript-mode-hook
                specdojo-markdown-mode-hook
                specdojo-yaml-mode-hook
                sh-mode-hook))
  (add-hook hook #'specdojo-eglot-ensure-if-available))

(provide 'init)
;;; init.el ends here
