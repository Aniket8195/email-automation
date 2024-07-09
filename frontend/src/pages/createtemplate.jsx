import { useState } from "react";
import { AppBarD } from "../components/AppBarD";
import { useUploadTemplate } from "../hooks/index";
import { useNavigate } from "react-router-dom";

export const CreateTemplate = () => {
  const [name, setName] = useState('');
  const [label, setLabel] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const { uploadTemplate, loading } = useUploadTemplate();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await uploadTemplate({ name, label, subject, body });
      navigate('/templates');
      console.log(name, label, subject, body);
    } catch (error) {
      console.error("Error uploading template", error);
    }
  };

  return (
    <div>
      <AppBarD />
      <div className="flex justify-center">
        <div className="flex flex-col w-full max-w-md">
          <h1 className="text-3xl font-bold mt-11 pt-11 text-center">Create Template</h1>
          <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="label">
                Label
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="label"
                type="text"
                placeholder="Label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
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
                disabled={loading}
              >
                {loading ? "Uploading..." : "Create Template"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
