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
  console.log("Solace green color class: text-solaceGreen");
  return (
    <main className="px-8 py-6 bg-gray-50">
      <h1 className="text-3xl font-semibold text-center text-solaceGreen mb-6">
        Solace Advocates
      </h1>

      <div className="mb-6">
        <div className="flex items-center gap-4">
          <input
            className="p-2 border-2 border-green-500 rounded-md w-1/3"
            value={searchText}
            onChange={onChange}
            placeholder="Search by name, city, or degree"
          />
          <button
            onClick={onClick}
            className="p-2 bg-solaceGreen text-white rounded-md hover:bg-green-600 transition"
          >
            Reset Search
          </button>
        </div>
        {searchText && <p className="mt-2 text-gray-500">Searching for: {searchText}</p>}
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full">
          <thead>
            <tr className="bg-green-100 text-green-700">
              <th className="py-2 px-4 border-b">First Name</th>
              <th className="py-2 px-4 border-b">Last Name</th>
              <th className="py-2 px-4 border-b">City</th>
              <th className="py-2 px-4 border-b">Degree</th>
              <th className="py-2 px-4 border-b">Specialties</th>
              <th className="py-2 px-4 border-b">Years of Experience</th>
              <th className="py-2 px-4 border-b">Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {advocates &&
              advocates.map((advocate, index) => {
                const rowClass = index % 2 === 0 ? "bg-green-50" : "bg-white";
                return (
                  <tr
                    key={`${advocate.firstName}-${advocate.lastName}-${advocate.phoneNumber}`}
                    className={rowClass}
                  >
                    <td className="py-2 px-4 border-b">{advocate.firstName}</td>
                    <td className="py-2 px-4 border-b">{advocate.lastName}</td>
                    <td className="py-2 px-4 border-b">{advocate.city}</td>
                    <td className="py-2 px-4 border-b">{advocate.degree}</td>
                    <td className="py-2 px-4 border-b">
                      {advocate.specialties.map((s) => (
                        <div
                          key={`${advocate.firstName}-${advocate.lastName}-${s}`}
                          className="text-sm"
                        >
                          {s}
                        </div>
                      ))}
                    </td>
                    <td className="py-2 px-4 border-b">{advocate.yearsOfExperience}</td>
                    <td className="py-2 px-4 border-b">{advocate.phoneNumber}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="px-4 py-2 bg-green-500 text-white rounded-md disabled:bg-gray-400 hover:bg-green-600 transition"
        >
          Previous
        </button>

        <span className="text-lg">
          Page {currentPage} of {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="px-4 py-2 bg-green-500 text-white rounded-md disabled:bg-gray-400 hover:bg-green-600 transition"
        >
          Next
        </button>
      </div>
    </main>
  );
}
