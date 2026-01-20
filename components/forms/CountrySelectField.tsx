/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Control, Controller, FieldError } from "react-hook-form";
import countryList from "react-select-country-list";
import ReactCountryFlag from "react-country-flag";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

type CountrySelectProps = {
  name: string;
  label: string;
  control: Control<any>;
  error?: FieldError;
  required?: boolean;
};

/**
 * CountrySelect
 * This is the pure UI component that:
 * - Displays a searchable dropdown list of countries
 * - Shows flags + country names
 * - Controls open/close state of the popover
 *
 * It only receives `value` and `onChange` like a normal input
 */
const CountrySelect = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  const [open, setOpen] = useState(false); // Control popover dropdown is open or closed

  // Get country options with flags EX: [ { value: 'US', label: 'United States' }, ... ]
  const countries = countryList().getData();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="country-select-trigger">
          {/* 
            If value exists → show selected country
            Otherwise → show placeholder text
          */}
          {value ? (
            <span className="flex items-center gap-2">
              <ReactCountryFlag
                countryCode={value}
                svg
                style={{
                  width: "2em",
                  height: "2em",
                }}
                title={value}
              />
              <span>{countries.find((c) => c.value === value)?.label}</span>
            </span>
          ) : (
            "Select your country..."
          )}
          {/* Dropdown icon */}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      {/* Dropdown content */}
      <PopoverContent className="w-full p-0 bg-gray-800 border-gray-600" align="start">
        <Command className="bg-gray-800 border-gray-600">
          {/* Search input */}
          <CommandInput placeholder="Search countries..." className="country-select-input" />
          {/* Shown when search has no results */}
          <CommandEmpty className="country-select-empty">No country found.</CommandEmpty>
          {/* Scrollable list */}
          <CommandList className="max-h-60 bg-gray-800 scrollbar-hide-default">
            <CommandGroup className="bg-gray-800">
              {countries.map((country) => (
                <CommandItem
                  key={country.value}
                  value={`${country.label} ${country.value}`}
                  onSelect={() => {
                    onChange(country.value);
                    setOpen(false); // close dropdown after selection
                  }}
                  className="country-select-item">
                  {/* 
                    Check icon only visible when this item is selected
                  */}
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 text-yellow-500",
                      value === country.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {/* Flag + label */}
                  <span className="flex items-center gap-2">
                    <ReactCountryFlag
                      countryCode={country.value}
                      svg
                      style={{
                        width: "2em",
                        height: "2em",
                      }}
                      title={country.value}
                    />
                    <span>{country.label}</span>
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

/**
 * CountrySelectField
 * This is the form-integrated version of CountrySelect
 *
 * Responsibilities:
 * - Connects CountrySelect to react-hook-form
 * - Handles validation
 * - Displays errors
 * - Shows label and helper text
 */
export const CountrySelectField = ({
  name,
  label,
  control,
  error,
  required = false,
}: CountrySelectProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="form-label">
        {label}
      </Label>
      {/* 
        Controller is used because:
        - CountrySelect is a custom input
        - It does NOT use ref like native inputs
        - So react-hook-form needs Controller to manage it
      */}
      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? `Please select ${label.toLowerCase()}` : false,
        }}
        render={({ field }) => (
          <CountrySelect
            value={field.value} // current form value
            onChange={field.onChange} // updates form state
          />
        )}
      />
      {/* Show validation error if exists */}
      {error && <p className="text-sm text-red-500">{error.message}</p>}
      {/* Helper text */}
      <p className="text-xs text-gray-500">Helps us show market data and news relevant to you.</p>
    </div>
  );
};
