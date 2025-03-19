"use client";

import { Advocate } from "@/app/types";
import { useEffect, useState } from "react";

const SEARCH_DEBOUNCE_DELAY = 300;
const DEFAULT_ITEMS_PER_PAGE = 10;

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const totalPages = Math.ceil(totalCount / DEFAULT_ITEMS_PER_PAGE);
  useEffect(() => {
    fetchAdvocates();
  }, [currentPage]);

  const fetchAdvocates = async () => {
    try {
      const response = await fetch(
        `/api/advocates?page=${currentPage}&pageSize=${DEFAULT_ITEMS_PER_PAGE}&searchTerm=${searchText}`
      );
      const jsonResponse = await response.json();
      setAdvocates(jsonResponse.advocates);
      setTotalCount(jsonResponse.totalCount);
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message);
      }
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchAdvocates();
    }, SEARCH_DEBOUNCE_DELAY);

    return () => clearTimeout(timeoutId);
  }, [searchText]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setSearchText(searchTerm);
  };

  const onClick = () => {
    setSearchText("");
    setCurrentPage(1);
  };

  const onPageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>Searching for: {searchText}</p>
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
          {advocates &&
            advocates.map((advocate) => {
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

      <div>
        {/* Pagination Controls */}
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </main>
  );
}
