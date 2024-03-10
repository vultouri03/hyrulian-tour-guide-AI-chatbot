import {useEffect, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


function App() {


    let SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
    let SpeechRecognitionEvent = window.webkitSpeechRecognitionEvent || window.SpeechRecognitionEvent

    const [answer, setAnswer] = useState("")
    const [speech, setSpeech] = useState("")
    let speechButton = false
    const [history, setHistory] = useState([])
    const [done, setDone] = useState("")
    const [showHistory, setShowHistory] = useState(false)
    const [button, setButton] = useState(true);



    if(window.webkitSpeechRecognition !== undefined) {
        console.log(window.webkitSpeechRecognition)
        speechButton = true
      }


    useEffect(() => {
        if(done ===  'hi')
        setHistory(history => [...history, ["assistant", answer]])
        setButton(true);
    }, [done])

    function startListening() {

        let recognition = new SpeechRecognition()
        recognition.lang = 'en-US'

        recognition.interimResults = false
        recognition.maxAlternatives = 1
        recognition.start()

        recognition.addEventListener("result", (event) => checkResult(event))

        recognition.onspeechend = function () {
            recognition.stop()
        }

        recognition.onerror = function (event) {
            console.log(event.error)
        }
    }

    function checkResult(event) {
        let speechResult = event.results[0][0].transcript.toLowerCase()
        setSpeech(speechResult)
        console.log(speechResult)

    }


    async function formSubmitHandler(event) {
        setAnswer("")
        setButton(false);
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());
        console.log(formJson.prompt);
        history.push(["human", formJson.prompt]);

        const options = {
            method: "POST", headers: {
                "Content-Type": "application/json",
            }, body: JSON.stringify({"prompt": history})
        }

        try {
            setDone("")
            const response = await fetch("https://hyrulian-tour-guide-ai-chatbot-1.onrender.com/chat", options)

            async function streamToString(body) {

                const reader = body?.pipeThrough(new TextDecoderStream()).getReader();
                while (reader) {
                    let stream = await reader.read();
                     // console.log("the stream", stream);
                    if (stream.done) {
                        setDone("hi")
                        setSpeech("")
                        break;
                    }


                        const chunks = stream.value
                            .replaceAll(/^data: /gm, "")
                            .split("\n")
                            .filter((c) => (c.length) && c !== "[DONE]")
                            .map((c) => c);
                        if (chunks) {
                            for (let chunk of chunks) {
                                const content = chunk
                                await setAnswer(answer => answer + content)
                                if (!content) continue;

                            }
                        }
                    }
            }

            await streamToString(response.body);

        } catch (err) {
            console.log(err);
            setAnswer("i am error")
            setButton(true);
        }
    }

const historyList = history.map((items, i) => {

    if(items[0] === "human") {
        return <>
            <h3 className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">you</h3>
            <div className={"appearance-none block w-full bg-green-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"}  key={i}>{items[1]}</div>
        </>
    } else {
    return <>
        <h3 className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Chatbot</h3>
        <div className={"appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"}  key={i}>{items[1]}</div>
    </>
    }})



  return (
    <>
      <section hidden={showHistory} className="bg-green-400 p-4 mt-10 m-3 rounded">
        <form onSubmit={formSubmitHandler} disabled={!button} className="w-full max-w-lg text-left bg-grey-400 rounded">
            <div hidden={button} className={"loader"}></div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-2/3 px-3">
              <label htmlFor="prompt" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">you</label>
              <input type="text" id="prompt" name="prompt" placeholder="What is your question"  defaultValue={speech} disabled={!button}
                     className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white disabled:bg-slate-500"/>
            </div>
            <div className="w-full md:w-1/3 px-3">
              <button type="submit" disabled={!button}
                      className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800 bg-black disabled:bg-slate-500 disabled:hidden">
                Ask your question
              </button>



            </div>
          </div>
        </form>
          <button className="inline-flex items-center px-5 mb-2 py-2.5 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800 bg-black disabled:hidden" disabled={!speechButton} type="click" onClick={startListening}>say your question</button>



          <h3 className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Chatbot</h3>
          <div className={"appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"}>{answer}  </div>
      </section>
        <button className="inline-flex items-center px-5 mb-2 py-2.5 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800 bg-black disabled:hidden " type="click" onClick={() => {
            if(showHistory) {
                setShowHistory(false)
            } else {
                setShowHistory(true)
            }
        }}>show history</button>
        <section className="bg-green-400 p-4 mt-10 m-3 rounded disabled:hidden" hidden={!showHistory}>

          <h2 className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">History</h2>
          <div>{historyList}</div>
        </section>


    </>
  )
}

export default App
