export function post_search_params() {
    document.addEventListener("DOMContentLoaded", function () {
        const element_search_form = document.getElementById("search-form");
  
        element_search_form.addEventListener("submit", function (e) {
            e.preventDefault();
            const form_data = new FormData(this);
        
            fetch("/searches", {
                method: "POST",
                body: form_data,
                headers: {
                    "X-CSRF-Token": document.querySelector("[name='csrf-token']").content
                }
            })
            .then(response => response.json())
            .then(data => {
                window.location.href = `/searches/${data.search_id}`;
            })
            .catch(error => console.error('Error:', error));
        });
    });
}