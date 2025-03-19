"use client";

import { Advocate } from "@/db/types";
import { useEffect, useState } from "react";

const SEARCH_DEBOUNCE_DELAY = 300;

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchAdvocates();
  }, []);

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      const term = searchText.toLowerCase();

      const filtered = advocates.filter((advocate) => {
        return (
          advocate.firstName.toLowerCase().includes(term) ||
          advocate.lastName.toLowerCase().includes(term) ||
          advocate.city.toLowerCase().includes(term) ||
          advocate.degree.toLowerCase().includes(term) ||
          advocate.specialties.some((s) => s.toLowerCase().includes(term)) ||
          advocate.yearsOfExperience.toString().includes(term) ||
          advocate.phoneNumber.toString().includes(term)
        );
      });

      setFilteredAdvocates(filtered);
    }, SEARCH_DEBOUNCE_DELAY);

    return () => clearTimeout(searchTimeout);
  }, [searchText, advocates]);

  const fetchAdvocates = async () => {
    try {
      const response = await fetch("/api/advocates");
      const jsonResponse = await response.json();
      setAdvocates(jsonResponse.data);
      setFilteredAdvocates(jsonResponse.data);
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message);
      }
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchText(searchTerm);
  };

  const onClick = () => {
    setSearchText("");
    setFilteredAdvocates(advocates);
  };

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>
          Searching for: <span id="search-term"></span>
        </p>
        <input
          style={{ border: "1px solid black" }}
          value={searchText}
          onChange={onChange}
          placeholder="search..."
        />
        <button onClick={onClick}>Reset Search</button>
      </div>
      <br />
      <br />
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>City</th>
            <th>Degree</th>
            <th>Specialties</th>
            <th>Years of Experience</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdvocates &&
            filteredAdvocates.map((advocate) => {
              return (
                <tr
                  key={`${advocate.firstName}-${advocate.lastName}-${advocate.phoneNumber}`}
                >
                  <td>{advocate.firstName}</td>
                  <td>{advocate.lastName}</td>
                  <td>{advocate.city}</td>
                  <td>{advocate.degree}</td>
                  <td>
                    {advocate.specialties.map((s) => (
                      <div key={`${advocate.firstName}-${advocate.lastName}-${s}`}>
                        {s}
                      </div>
                    ))}
                  </td>
                  <td>{advocate.yearsOfExperience}</td>
                  <td>{advocate.phoneNumber}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </main>
  );
}
