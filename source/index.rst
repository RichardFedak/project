First Steps
===========

Installation
------------

The **evalmy.ai** client library requires Python 3.8 or higher.

To install the library, run the following command:

.. code-block:: bash
   python -m pip install evalmyai

Simple Usage
-------------

Here’s an example of simple usage:

.. code-block:: python
   from evalmyai import Evaluator

   data = {
       "expected": "Jane is twelve.",
       "actual": "Jane is 12 yrs, 7 mths and 3 days old."
   }

   evaluator = Evaluator(...) # see authentication later

   result = evaluator.evaluate(data)

   print(result['contradictions'])

The result of the evaluation is as follows:

.. code-block::

   {
       "score": 1.0,
       "reasoning": {
           "statements": [
               {
                   "reasoning": "The statement from <TEXT 1> 'Jane is twelve' provides a general age for Jane, while <TEXT 2> 'Jane is 12 yrs, 7 mths and 3 days old' provides a more precise age. There is no contradiction between the two statements, as the second text simply provides more detail on Jane's age, but does not conflict with the first text's assertion that she is twelve years old. The criterion for severity in this context could be based on the impact of the age description on understanding Jane's age. Since both statements agree on Jane being twelve, the severity of the difference in description is negligible.",
                   "summary": "Slight difference in the description of Jane's age.",
                   "severity": "negligible"
               }
           ]
       }
   }

Authentication
--------------

To get started, you'll need your **EVALMY.AI** service token, which you can obtain [here](https://evalmy.ai).

The service runs on your own instance of GPT, either through Azure or an OpenAI endpoint you provide. Due to capacity limits per organization, we cannot provide a direct GPT endpoint.

Azure Configuration
-------------------

If you use an Azure endpoint, the configuration should look like this:

.. code-block:: python

   token = "YOUR_EVALMYAI_TOKEN"

   auth_azure = {
       "api_key": "cd0...101",
       "azure_endpoint": "https://...azure.com/",
       "api_version": "2023-07-01-preview",
       "azure_deployment": "...",
   }

   evaluator = Evaluator(auth_azure, token)

OpenAI Configuration
--------------------

If you use an OpenAI endpoint, the configuration should look like this:

.. code-block:: python

   token = "YOUR_EVALMYAI_TOKEN"

   auth_open_ai = {
       "api_key": "...",
       "model": "gpt-4o" # select your model, we strongly recommend GPT-4.
   }

   evaluator = Evaluator(auth_open_ai, token)
