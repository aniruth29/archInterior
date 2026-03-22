document.addEventListener('DOMContentLoaded', () => {
    /* =========================================
       Dynamic Gallery & Filter Logic
       ========================================= */
    const galleryTabs = document.querySelectorAll('.gallery-tab');
    const projectsGrid = document.getElementById('projectsGrid');

    // Function to render the gallery grid based on category and search params
    function renderGallery(filterParam) {
        projectsGrid.innerHTML = ''; // Clear existing items

        const categoriesToRender = [];
        if (filterParam === 'all' || filterParam === 'residential') {
            categoriesToRender.push({ name: 'Residential Project', cssClass: 'residential' });
        }
        if (filterParam === 'all' || filterParam === 'commercial') {
            categoriesToRender.push({ name: 'Commercial Project', cssClass: 'commercial' });
        }

        categoriesToRender.forEach(categoryObj => {
            const clients = portfolioData[categoryObj.name];
            if (clients) {
                clients.forEach((clientData, index) => {
                    // We need at least one image to show
                    if (clientData.images && clientData.images.length > 0) {
                        const firstImage = `images/project_page/${categoryObj.name}/${clientData.client}/${clientData.images[0]}`;

                        const itemHtml = `
                            <div class="gallery-item ${categoryObj.cssClass}" style="opacity: 1; transition: opacity 0.5s ease;">
                                <div class="gallery-img-wrapper cursor-zoom" data-category="${categoryObj.name}" data-client-index="${index}">
                                    <img src="${firstImage}" alt="${clientData.client} Project" loading="lazy">
                                    <div class="hover-overlay">
                                        <span class="material-symbols-outlined">add</span>
                                        <div style="color: white; font-weight: bold; margin-top: 10px; z-index: 2;">${clientData.client}</div>
                                    </div>
                                </div>
                            </div>
                        `;
                        projectsGrid.insertAdjacentHTML('beforeend', itemHtml);
                    }
                });
            }
        });

        // Re-attach click listeners to the wrappers
        const wrappers = document.querySelectorAll('.gallery-img-wrapper');
        wrappers.forEach(wrapper => {
            wrapper.addEventListener('click', () => {
                const category = wrapper.getAttribute('data-category');
                const clientIndex = wrapper.getAttribute('data-client-index');
                openModalForClient(category, parseInt(clientIndex, 10));
            });
        });
    }

    // Function to handle tab UI
    function setActiveTab(category) {
        galleryTabs.forEach(tab => {
            if (tab.getAttribute('data-filter') === category) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });
    }

    // Read URL for filter parameters if user came from homepage "What We Offer"
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter') || 'all';

    // Initial render
    setActiveTab(filterParam);
    renderGallery(filterParam);

    // Listeners for manual tab clicking
    galleryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const filter = tab.getAttribute('data-filter');
            setActiveTab(filter);
            renderGallery(filter);

            // Optionally update URL gracefully
            const url = new URL(window.location);
            url.searchParams.set('filter', filter);
            window.history.replaceState({}, '', url);
        });
    });


    /* =========================================
       Client-Specific Image Slider Modal Logic
       ========================================= */
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImg");
    const closeBtn = document.querySelector(".close-modal");
    const nextBtn = document.querySelector(".modal-next");
    const prevBtn = document.querySelector(".modal-prev");

    let currentImageIndex = 0;
    let currentClientImages = []; // Will store full image paths for the clicked client

    function openModalForClient(categoryName, clientIndex) {
        const clientData = portfolioData[categoryName][clientIndex];

        // Build the full paths for all images of this client
        currentClientImages = clientData.images.map(img => `images/project_page/${categoryName}/${clientData.client}/${img}`);

        if (currentClientImages.length > 0) {
            currentImageIndex = 0; // Start at the first image
            modalImg.src = currentClientImages[currentImageIndex];
            modal.style.display = "flex";
            document.body.style.overflow = 'hidden'; // Prevent page scrolling
        }
    }

    function closeModal() {
        modal.style.display = "none";
        document.body.style.overflow = 'auto'; // Revert scroll
        currentClientImages = [];
    }

    function showNextImage() {
        if (currentClientImages.length === 0) return;
        currentImageIndex++;
        if (currentImageIndex >= currentClientImages.length) {
            currentImageIndex = 0; // loop back
        }
        modalImg.src = currentClientImages[currentImageIndex];
    }

    function showPrevImage() {
        if (currentClientImages.length === 0) return;
        currentImageIndex--;
        if (currentImageIndex < 0) {
            currentImageIndex = currentClientImages.length - 1; // loop to end
        }
        modalImg.src = currentClientImages[currentImageIndex];
    }

    // Modal Events
    closeBtn.addEventListener('click', closeModal);
    nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNextImage(); });
    prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrevImage(); });

    // Close when clicking outside image
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (modal.style.display === "flex") {
            if (e.key === 'Escape') closeModal();
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
        }
    });
});
