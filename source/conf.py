# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

project = 'IoT Project'
copyright = '2024, RF'
author = 'RF'

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = [
    'sphinx.ext.autodoc',          # Automatically document code from docstrings
    'sphinx.ext.napoleon',         # Support for Google-style and NumPy-style docstrings
    'sphinx.ext.todo',             # Enable TODO directives in documentation
    'sphinx.ext.viewcode',         # Add links to highlighted source code
]

# Enable TODOs in the output
todo_include_todos = True

templates_path = ['_templates']
exclude_patterns = []

# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = 'furo'  # A clean, modern theme. Install with: pip install furo
html_static_path = ['_static']

# Add custom CSS and JavaScript files
html_css_files = [
    'custom.css',  # Place this file in the _static folder
]

html_js_files = [
    'custom.js',  # Place this file in the _static folder
]

# -- Napoleon settings -------------------------------------------------------
# Configure Napoleon for Google/NumPy-style docstrings
napoleon_google_docstring = True
napoleon_numpy_docstring = True

# -- Autodoc settings --------------------------------------------------------
# Configure autodoc behavior
autodoc_default_options = {
    'members': True,              # Document all class/module members
    'undoc-members': True,        # Include members without docstrings
    'private-members': False,     # Exclude private members
    'special-members': '__init__',# Include __init__ method
    'show-inheritance': True,     # Show class inheritance
}
