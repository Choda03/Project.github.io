document.addEventListener("DOMContentLoaded", function () {
    const gallery = document.getElementById("gallery");
    const searchBox = document.getElementById("searchBox");
    const categoryList = document.getElementById("categoryList");
    const modeToggle = document.querySelector(".mode-toggle");

    let images = JSON.parse(localStorage.getItem("uploadedImages")) || [
        { src: "nature.webp", category: "Nature" },
        { src: "technology.jpg", category: "Technology" },
        { src: "art.jpg", category: "Art" },
        { src: "architecture.jpg", category: "Architecture" },
        { src: "animal.jpg", category: "Animals" },
        { src: "food.jpg", category: "Food" },
        { src: "travel.webp", category: "Travel" },
        { src: "sports.jpg", category: "Sports" }
    ];

    let likes = JSON.parse(localStorage.getItem("likes")) || {};

    function displayImages(filteredCategory = "All") {
        if (!gallery) return;
        gallery.innerHTML = "";
        images
            .filter(image => filteredCategory === "All" || image.category === filteredCategory)
            .forEach((image, index) => {
                const imageCard = document.createElement("div");
                imageCard.classList.add("image-card");
                imageCard.innerHTML = `
                    <img src="${image.src}" alt="${image.category}" loading="lazy" onclick="openModal('${image.src}', '${image.category}')">
                    <div class="text-center mt-2">${image.category}</div>
                    <div class="image-actions">
                        <button class="like-btn" onclick="toggleLike(${index})">
                            ❤️ <span id="like-count-${index}">${likes[image.src] || 0}</span>
                        </button>
                        <button class="download-btn" onclick="downloadImage('${image.src}')">📥</button>
                        <button class="share-btn" onclick="shareImage('${image.src}')">🔗</button>
                    </div>
                `;
                gallery.appendChild(imageCard);
            });

        updateCategoryDropdown();
        fadeInImages();
    

        function fadeInImages() {
            document.querySelectorAll(".image-card img").forEach(img => {
                img.onload = () => img.classList.add("loaded");
            });
        }
    }

    function updateCategoryDropdown() {
        if (!categoryList) return;
        categoryList.innerHTML = `<li><a class="dropdown-item" href="#" onclick="displayImages('All')">All</a></li>`;
        
        const uniqueCategories = [...new Set(images.map(img => img.category))];
        uniqueCategories.forEach(category => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `<a class="dropdown-item" href="#" onclick="displayImages('${category}')">${category}</a>`;
            categoryList.appendChild(listItem);
        });
    }

    window.uploadUserImage = function () {
        const fileInput = document.getElementById("uploadImage");
        const categoryInput = document.getElementById("uploadCategory");
    
        if (!fileInput || !categoryInput) return;
    
        if (fileInput.files.length === 0 || !categoryInput.value.trim()) {
            alert("Please select an image and enter a category!");
            return;
        }
    
        const file = fileInput.files[0];
        const validTypes = ["image/jpeg", "image/png", "image/gif"];
        if (!validTypes.includes(file.type)) {
            alert("Please upload a valid image file (JPEG, PNG, GIF).");
            return;
        }
    
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            alert("Image size should be less than 5MB.");
            return;
        }
    
        const reader = new FileReader();
        reader.onload = function (e) {
            images.push({ src: e.target.result, category: categoryInput.value.trim() });
            localStorage.setItem("uploadedImages", JSON.stringify(images));
            displayImages();
        };
        reader.readAsDataURL(file);
    
        fileInput.value = "";
        categoryInput.value = "";
    };

    window.toggleLike = function (index) {
        const image = images[index].src;
        likes[image] = (likes[image] || 0) + 1;
        localStorage.setItem("likes", JSON.stringify(likes));
        document.getElementById(`like-count-${index}`).textContent = likes[image];

        updateFavorites();
    };

    function updateFavorites() {
        if (document.getElementById("favoritesGallery")) {
            const favoritesGallery = document.getElementById("favoritesGallery");
            favoritesGallery.innerHTML = "";

            for (const imageUrl in likes) {
                const img = document.createElement("img");
                img.src = imageUrl;
                img.classList.add("gallery-image");
                favoritesGallery.appendChild(img);
            }
        }
    }

    window.downloadImage = function (imageUrl) {
        const a = document.createElement("a");
        a.href = imageUrl;
        a.download = "downloaded_image.jpg";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    window.shareImage = function (imageUrl) {
        if (navigator.share) {
            navigator.share({
                title: "Check out this amazing image!",
                url: imageUrl
            }).catch(err => console.log("Error sharing:", err));
        } else {
            navigator.clipboard.writeText(imageUrl).then(() => {
                alert("Image link copied to clipboard!");
            });
        }
    };

    function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    let btn = document.getElementById("dark-mode-btn");
    btn.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
    }

    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark-mode");
    }

    if (modeToggle) {
        modeToggle.addEventListener("click", toggleDarkMode);
    }

    displayImages();
    updateFavorites();
});
