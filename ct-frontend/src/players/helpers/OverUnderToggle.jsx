import { useState } from 'react';
import { RadioGroup } from '@headlessui/react';


function OverUnderToggle({ selectedValue, onChange }) {
    

  return (
    <div className="py-2 px-4">
      <RadioGroup value={selectedValue} onChange={onChange}>
        <div className="">
          {['Over', 'Under'].map((option) => (
            <RadioGroup.Option
              key={option}
              value={option}
              className={({ active, checked }) =>
                `${
                  active
                    ? 'ring-2 ring-white/60 ring-offset-2 ring-offset-sky-300'
                    : ''
                }
                ${checked ? 'bg-green text-white ring-1 ring-white/60' : 'bg-gray-500 text-white'}
                relative flex cursor-pointer text-center rounded-sm px-5 py-2 mb-2 shadow-md focus:outline-none`
              }
            >
              {({ active, checked }) => (
                <div className="flex items-center justify-center">
                  <RadioGroup.Label
                    as="p"
                    className={`font-medium ${
                      checked ? 'text-gray-100' : 'text-gray-100'
                    }`}
                  >
                    {option}
                  </RadioGroup.Label>
                  <input
                    type="hidden"
                    value={option}
                  />
                </div>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </div>
  )
};


export default OverUnderToggle;
