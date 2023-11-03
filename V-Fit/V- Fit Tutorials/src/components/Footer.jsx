import React from "react";
import { FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer aria-label="Site Footer" className="bg-gray-900 h-auto">
      <div className="max-width-xl px-4 pt-16 pb-8 mx-auto sm:px-6 lg:px-8 lg:pt-24">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-5xl">
            Be Fit With V-Fit
          </h2>

          <p className="max-w-sm mx-auto mt-4 text-gray-400">
          We are what we repeatedly do. Excellence then is not an act but a habit.
          </p>
          <p className="max-w-sm mx-auto mt-0 text-gray-400">
            Feel free to{" "}
            <a
              className="text-white underline decoration-transparent transition ease-in-out hover:decoration-inherit"
              href="contactkilink"
              target="_blank"
              rel="noopener noreferrer"
            >
              CONTACT US
            </a>
            .
          </p>
        </div>

        <div className="pt-8 mt-16 border-t flex gap-3 border-gray-800 sm:justify-between lg:mt-24">
          <a
            href=""
            target="_blank"
            className="text-white"
          >
            Copyright &copy; www.V-Fit.com All rights reserved!
          </a>

          <a
            href=""
            rel="noopener noreferrer"
            target="_blank"
            className="text-gray-100 transition hover:opacity-75 dark:text-gray-200"
          >
            <FaGithub className="text-2xl" />
          </a>
        </div>
      </div>
    </footer>
  );
}
