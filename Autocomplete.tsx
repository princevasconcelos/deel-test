import React, { useState, useEffect, useRef } from 'react';

interface Option {
  title: string;
  value: string;
}

interface AutocompleteProps {
  options: Option[];
  filter: (query: string) => Promise<Option[]>;
}

const Autocomplete: React.FC<AutocompleteProps> = ({ options, filter }) => {
  const [query, setQuery] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<Option[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (query) {
      filter(query).then(setFilteredOptions);
    } else {
      setFilteredOptions([]);
    }
    setHighlightedIndex(-1);
  }, [query]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleOptionClick = (value: string) => {
    setQuery(value);
    setFilteredOptions([]);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
    case 'ArrowDown':
      setHighlightedIndex((prevIndex) =>
        prevIndex === filteredOptions.length - 1 ? 0 : prevIndex + 1
      );
      break;
    case 'ArrowUp':
      setHighlightedIndex((prevIndex) =>
        prevIndex === 0 ? filteredOptions.length - 1 : prevIndex - 1
      );
      break;
    case 'Enter':
      if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
        setQuery(filteredOptions[highlightedIndex].title);
        setFilteredOptions([]);
      }
      break;
    case 'Escape':
      setFilteredOptions([]);
      break;
    default:
      break;
    }
  };

  return (
    <div>

      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        ref={inputRef}
      />
      {filteredOptions.length > 0 && (
        <ul>
          {filteredOptions.map((option, index) => {
            const markdown = option.title.replace(
              new RegExp(`(${query})`, 'gi'),
              '<mark>$1</mark>'
            )

            return (
              <li
                key={option.value}
                onClick={() => handleOptionClick(option.title)}
                className={index === highlightedIndex ? 'highlighted' : undefined}
              >
                <div dangerouslySetInnerHTML={{ __html: markdown }} />

              </li>
            )
          })}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
