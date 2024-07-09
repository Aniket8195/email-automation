

export const templateCard = (template) => {
     return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg m-4">
            <div className="px-6 py-4">
                <label htmlFor="Name" className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                <div className="font-bold text-xl mb-2">{template.name}</div>
                <label htmlFor="Label">Label</label>
                <p className="text-gray-700 text-base">
                    {template.label}
                </p>
                <label htmlFor="Subject"className="block text-gray-700 text-sm font-bold mb-2">Subject</label>
                <p className="text-gray-700 text-base">
                    {template.subject}
                </p>
            </div>
           
            <div className="px-6 py-4">
            <label htmlFor="Body"className="block text-gray-700 text-sm font-bold mb-2">Body</label>
          <div className="overflow-y-auto max-h-40 text-gray-700 text-base">
          {template.body.split('\n').map((line, index) => (
            <p key={index} className="break-words">
              {line}
            </p>
          ))}
         </div>
      </div>
        </div>
     )
}