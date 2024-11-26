# Configuration file for the Sphinx documentation builder.

# -- Path setup --------------------------------------------------------------
import os
import sys
sys.path.insert(0, os.path.abspath('../'))

# -- Project information -----------------------------------------------------
project = 'My Project'
author = 'Your Name'
release = '1.0.0'

# -- General configuration ---------------------------------------------------
extensions = [
    'sphinx.ext.autodoc',        # Automatically document code from docstrings
    'sphinx.ext.napoleon',       # Google-style docstrings support
    'sphinx.ext.viewcode',       # Add links to highlighted source code
    'sphinx.ext.githubpages'     # Publish docs on GitHub Pages
]

templates_path = ['_templates']
exclude_patterns = ['_build', 'Thumbs.db', '.DS_Store']

# -- Options for HTML output -------------------------------------------------
html_theme = 'alabaster'  # Minimalistic theme, can be changed to 'sphinx_rtd_theme'
html_static_path = ['_static']

# -- Extensions configuration ------------------------------------------------
# Napoleon settings for Google-style docstrings
napoleon_google_docstring = True
napoleon_numpy_docstring = False
napoleon_include_init_with_doc = False
napoleon_include_private_with_doc = False
napoleon_include_special_with_doc = True
napoleon_use_admonition_for_examples = False
napoleon_use_admonition_for_notes = False
napoleon_use_admonition_for_references = False
napoleon_use_ivar = False
napoleon_use_param = True
napoleon_use_rtype = True

