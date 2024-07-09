import { useState } from "react";
import { AppBarD } from "../components/AppBarD";
import { useFetchTemplates } from "../hooks/index";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "../components/dropdown";
import { format } from 'date-fns';
import { useUploadSchedule } from "../hooks/index";
import {HashLoader} from 'react-spinners'
export const CreateSchedule = () => {
  const [templateId, setTemplateId] = useState('');
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sendAt, setSendAt] = useState('');
  const { loading, templates } = useFetchTemplates();
  const navigate = useNavigate();
    const { uploadSchedule ,loading1} = useUploadSchedule();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedSendAt = sendAt ? format(new Date(sendAt), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx") : null;
      await uploadSchedule({ templateId, recipient, subject, body, sendAt: formattedSendAt });
      
      console.log({
        templateId,
        recipient,
        subject,
        body,
        sendAt: formattedSendAt,
      });

      navigate('/scheduledEmails');
      
    } catch (error) {
      console.error("Error uploading template", error);
    }
  };
  if(loading){
    return <div className="flex justify-center items-center">
      <HashLoader color={"#2563EB"} loading={loading} size={50} />
  </div>
  }
  return (
    <div>
      <AppBarD />
      <div className="flex justify-center">
        <div className="flex flex-col w-full max-w-md">
          <h1 className="text-3xl font-bold mt-11 pt-11 text-center">Create Template</h1>
          <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Select Template
              </label>
              <Dropdown templates={templates} selected={templateId} setSelected={setTemplateId} />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="recipient">
                Recipient
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="recipient"
                type="text"
                placeholder="Recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subject">
                Subject
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="subject"
                type="text"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sendAt">
                Send At
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="sendAt"
                type="datetime-local"
                value={sendAt}
                onChange={(e) => setSendAt(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="body">
                Body
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="body"
                placeholder="Body"
                rows="5"
                value={body}
                onChange={(e) => setBody(e.target.value)}
              ></textarea>
            </div>
            <div className="flex items-center justify-center">
              <button
                className={`bg-black hover:bg-slate-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                type="submit"
                disabled={loading1}
              >
                {loading1 ? "Uploading..." : "Schedule Email"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
