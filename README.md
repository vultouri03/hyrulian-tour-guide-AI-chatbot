Welcome to the hyrulian tour guide AI chatbot, the purpose of this program is to guide players of the hit game breath of the wild during their journey using CHATGPT and the botw backend api https://gadhagod.github.io/Hyrule-Compendium-API/#/.

The program can be tested here: https://hyrulian-tour-guide-ai-chatbot-2.onrender.com

Instalation

To install the tour guide client for your own use or for further development you can clone this repository. 
After which you need to check out the client folder by writing the folowing line in the terminal cd client.
After that you need to run npm install to download the necesary packages. if you wish to edit it or to run it on your own device run npm run dev. 

If you also want to install the server you need to check out the server in a new terminal by using cd server.
After that you also need to run npm install to download the packages.
Before you can run the code you need to add a new file in the server directory called .env . once that is done you have to add your own API keys to that file in this way:

OPENAI_API_TYPE=___

OPENAI_API_VERSION=___

OPENAI_API_BASE=___

AZURE_OPENAI_API_KEY=___

DEPLOYMENT_NAME=___

ENGINE_NAME=___

INSTANCE_NAME=___

After that is done you can run npm run dev to run your own version of the server.

Known Issues

There is a folder called Anthropic test, this is used to test the anthropic API and can be used to implement the use of that API into the main program. This code is not that extensive and needs a lot of work to be implemented.

The compendium API is not used at the moment due to being too big. if you want to ask about ingredients in hyrule you can swap the region list with the compendium list and edit the prompt on line 56 in server.js to fit this change.

The Speech recognition only works when you don't type in the input row

When using the hosted backend, the first request might take a while, this is due to it being hosted on render
