let store = {};

async function loadStore() {
    const text = await (await fetch("store.txt")).text();
    store = parseStore(text);
}

function parseStore(text) {
    const data = {};
    let category = null;
    let project = null;

    for (const raw of text.split("\n")) {
        const line = raw.trim();
        if (!line) continue;

        const colon = line.indexOf(":");
        if (colon === -1) continue;

        const key = line.slice(0, colon).trim();
        const value = line.slice(colon + 1).trim();

        if (key === "category") {
            category = value;
            data[category] = { image: "", projects: {} };
            project = null;
        } else if (key === "cover" && category) {
            data[category].image = value;
        } else if (key === "project" && category) {
            project = value;
            data[category].projects[project] = {
                name: value,
                featured: false,
                description: "",
                github: "",
                assetLib: "",
                video: "",
                image: "",
                images: [],
                features: []
            };
        } else if (project && category) {
            const item = data[category].projects[project];
            if (key === "featured") {
                item.featured = (value === "yes" || value === "true");
            } else if (key === "images" || key === "features") {
                item[key] = value ? value.split("|").map(function (part) {
                    return part.trim();
                }) : [];
            } else {
                item[key] = value;
            }
        }
    }
    return data;
}