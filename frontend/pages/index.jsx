import { useState, useEffect } from "react";
import {Transition} from "@headlessui/react"
import { Formik, Field, Form } from "formik";
import axios from "axios"
import Fuse from 'fuse.js'

const HomePage = () => {
  const [showAddModel, setShowAddModel] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [models, setModels] = useState([]);
  const [resModels, setResModels] = useState([]);
  const [fuse, setFuse] = useState(null);

  useEffect(() => {
    axios.get("/api/models/get")
      .then((res) => {
        setModels(res.data);
        setResModels(res.data);
      })
  }, [])

  useEffect(() => {
    setFuse(new Fuse(models, {keys: ["modelName", "dataset", "username"]}));
  }, [models])

  const createModel = (values, actions) => {
    const formData = new FormData();
    formData.append("username", values.username);
    formData.append("modelName", values.modelName);
    formData.append("scale", values.scale);
    formData.append("accuracy", values.accuracy);
    formData.append("dataset", values.dataset);
    formData.append("modelFile", values.modelFile);

    axios.post("/api/models/create",formData,{headers: {'content-type': 'multipart/form-data'}})
      .then((res) => {
        console.log("success");
        actions.setSubmitting(false);
        setShowAddModel(false);
      })
      .catch((err) => {
        actions.setSubmitting(false);
      })
  }

  return (
    <>
    {showAddModel && (
      <div
      className="fixed z-10 inset-0 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={() => setShowAddModel(false)}
    >
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <Transition
          show={showAddModel}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          {() => (
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            />
          )}
        </Transition>
  
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
  
        <div
          className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
          tabIndex={-1}
          onClick={(event) => event.stopPropagation()}
        >
          <div>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full">
              <img src="/ai.svg" />
            </div>
            <div className="mt-3 sm:mt-5">
              <h3
                className="text-lg text-center leading-6 font-medium text-gray-900"
                id="modal-title"
              >
                Upload pruned model
              </h3>
              <div className="mt-6">
                <Formik
                  initialValues={{username: "", modelName: "", scale: undefined, accuracy: undefined, dataset: "", modelFile: undefined}}
                  onSubmit={createModel}
                >
                  {({ setFieldValue, values, isSubmitting }) => (
                  <Form>
                    <div className="grid grid-cols-2 gap-x-5 gap-y-4">
                      <div>
                        <label className="block text-gray-600 text-sm font-semibold mb-2" for="title">
                          Username
                        </label>
                        <Field
                          className="bg-gray-100 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="title"
                          type="text"
                          name="username"
                          placeholder="john-doe"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-600 text-sm font-semibold mb-2" for="title">
                          Model name
                        </label>
                        <Field
                          className="bg-gray-100 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="title"
                          type="text"
                          name="modelName"
                          placeholder="resnet18"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-600 text-sm font-semibold mb-2" for="title">
                          Dataset
                        </label>
                        <Field
                          className="bg-gray-100 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="title"
                          type="text"
                          name="dataset"
                          placeholder="CIFAR10"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-600 text-sm font-semibold mb-2" for="title">
                          Accuracy (percent)
                        </label>
                        <Field
                          className="bg-gray-100 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="title"
                          type="number"
                          name="accuracy"
                          placeholder="93.15"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-600 text-sm font-semibold mb-2" for="title">
                          Pruning ratio
                        </label>
                        <Field
                          className="bg-gray-100 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="title"
                          type="number"
                          name="scale"
                          placeholder="0.5"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-gray-600 text-sm font-semibold mb-2" for="title">
                          Model file
                        </label>
                      <div class="mt-1 flex justify-center px-6 pt-2 pb-3 border-2 border-gray-300 border-dashed rounded-md">
                        <div class="space-y-1 text-center">
                          {/* <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                          </svg> */}
                          {!values.modelFile && (<img className="mx-auto h-10 w-10 text-gray-200" src="/file.svg" />)}
                          <div class="flex text-sm text-gray-600">
                            {values.modelFile ? (
                              <>
                                1 model file selected
                              </>
                            ) : (
                              <>
                              <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                <span>Upload model file</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={(event) => { setFieldValue("modelFile", event.currentTarget.files[0]);}} />
                              </label>
                              <p class="pl-1">or drag and drop</p>
                            </>
                            )}
                          </div>
                        </div>
                      </div>         
                    </div>

                    <div className="text-center mt-7">
                    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                      {isSubmitting ? (<div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-8 w-8 mx-4"/>) : (
                        <>Upload model</>
                      )}
                    </button>
                    </div>
                  </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    )}

    {showDownload && (
      <div
      className="fixed z-10 inset-0 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={() => setShowDownload(false)}
    >
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <Transition
          show={showDownload}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          {() => (
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            />
          )}
        </Transition>
  
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
  
        <div
          className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
          tabIndex={-1}
          onClick={(event) => event.stopPropagation()}
        >
          <div>
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg
                className="h-6 w-6 text-green-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="mt-3 text-center sm:mt-5">
              <h3
                className="text-lg leading-6 font-medium text-gray-900"
                id="modal-title"
              >
                Download starting
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Due to the size of the model files, it may take a few seconds before the download
                  appears. Please do not exit the window.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    )}

    <div className="header-2 border-b">

      <nav className="bg-white py-2 md:py-4">
        <div className="container mx-auto md:flex md:items-center">

          <div className="flex justify-between items-center">
            <a href="#" className="font-black text-3xl text-indigo-600">WinningTickets</a>
            <button className="border border-solid border-gray-600 px-3 py-1 rounded text-gray-600 opacity-50 hover:opacity-75 md:hidden" id="navbar-toggle">
              <i className="fas fa-bars"></i>
            </button>
          </div>

          <div className="md:flex flex-col md:flex-row md:ml-auto mt-3 md:mt-0">
            <a href="#" onClick={() => setShowAddModel(true)} className="px-4 py-3 mx-2 text-white rounded bg-indigo-600 font-bold">Add ticket</a>
          </div>
        </div>
      </nav>
    </div>

    <div className="mt-9 container mx-auto">
      <div className="flex items-center">
        <h1 className="text-black font-normal text-xl">Models <span className="text-gray-500 font-light ml-1">{resModels.length}</span></h1>
        <div className="bg-white border border-gray-300 flex items-center rounded-full shadow-md ml-5">
          <input className="rounded-full w-full py-2 pl-5 pr-8 text-gray-700 leading-tight focus:outline-none" id="search" type="text" placeholder="Search models"
            onChange={(e) => {
              if (!e.target.value) {
                setResModels(models)
              } else {
                const fRes = fuse.search(e.target.value)
                const fResFormat = fRes.map((obj) => obj.item)
                setResModels(fResFormat)}}
              }
          />
        </div>
      </div>
    </div>

      <div className="container mx-auto grid grid-cols-2 gap-x-8 gap-y-6 mt-8">

        {resModels.map((model) => (
          <a href={`/api/models/${model.fileName}/get`} download={`${model.modelName}.pt`} onClick={() => setShowDownload(true)} className="hover:text-indigo-400">
            <div className="bg-gray-100 p-3 shadow-lg rounded-lg flex justify-between items-center">
              <div className="flex">
                <div>
                  <h1 className="text-xl font-medium text-gray-700 model-text">{model.modelName}</h1>
                  <div className="flex items-center text-sm text-gray-500">
                    <p>Username: {model.username}</p>
                    <span className="mx-1.5">•</span>
                    <p>Dataset: {model.dataset}</p>
                    <span className="mx-1.5">•</span>
                    <p>Prune factor: {model.scale}</p>
                    <span className="mx-1.5">•</span>
                    <p>Accuracy: {model.accuracy}</p>
                  </div>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </>
  )
}

export default HomePage