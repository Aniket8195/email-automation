import { useState } from 'react';
import PropTypes from 'prop-types';

export const Dropdown = ({ templates, selected, setSelected }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (template) => {
    setSelected(template.id);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left w-full">
      <button
        id="dropdownDefaultButton"
        onClick={handleToggle}
        className="w-full text-white bg-black hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-center dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
        type="button"
      >
        {selected ? templates.find(t => t.id === selected).label : 'Select template'}
        <svg
          className="w-2.5 h-2.5 ml-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 10 6"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 4 4 4-4"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          id="dropdown"
          className="z-10 absolute right-0 mt-2 w-full bg-black divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700"
        >
          <ul className="py-2 text-sm text-gray-100 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
            {templates.map((template) => (
              <li key={template.id}>
                <button
                  className="block w-full px-4 py-2 hover:bg-gray-800 dark:hover:bg-gray-600 dark:hover:text-white text-center"
                  onClick={() => handleSelect(template)}
                >
                  {template.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

Dropdown.propTypes = {
  templates: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  selected: PropTypes.number,
  setSelected: PropTypes.func.isRequired,
};

Dropdown.defaultProps = {
  selected: null,
};
