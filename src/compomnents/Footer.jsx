import React from "react";

function Footer() {
  return (
    <div>
      {" "}
      <footer class="footer h-16 flex items-center px-6 bg-white shadow dark:bg-gray-800 mt-auto">
        <div class="flex md:justify-between justify-center w-full gap-4">
          <div>
            <script>document.write(new Date().getFullYear())</script> © -{" "}
            <a>2026 - JRM Infotech</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
