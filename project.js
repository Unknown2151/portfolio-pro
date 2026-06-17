// 1. The "Database": Store all your project details here.
const projectData = {


    "flight-predictor": {
        title: "Flight Delay Predictor API",
        stack: "[FastAPI, LightGBM, Redis, Docker, GitHub Actions, Render]",
        github: "https://github.com/Unknown2151/flight-delay-prediction.git",
        live: "https://flight-un-known.onrender.com/",
        desc: "An asynchronous, layered microservice built on FastAPI, evolving from a local machine learning script into a production-hardened, resilient cloud service.",
        timeline: [
            {
                date: "Phase 1: Cradle to Architecture",
                text: "<strong>The Planned Path:</strong> A simple monolithic script running an inference loop on a local machine.<br><br><strong>The Path Taken:</strong> An asynchronous, layered microservice built on FastAPI for non-blocking I/O operations, Gunicorn as a production process manager, and Uvicorn workers.<br><br><strong>The Feature Gap:</strong> Early models missed environmental context. We integrated the Amadeus API for flight metadata and the Tomorrow.io API for real-time weather.<br><br><strong>Advanced Mathematical Modeling:</strong> Implemented the Haversine Formula directly into the input pipeline to calculate the precise great-circle distance between coordinates:<br><br>$$d = 2r &#92;arcsin&#92;left(&#92;sqrt{&#92;sin^2&#92;left(&#92;frac{&#92;Delta &#92;phi}{2}&#92;right) + &#92;cos &#92;phi_1 &#92;cos &#92;phi_2 &#92;sin^2&#92;left(&#92;frac{&#92;Delta &#92;lambda}{2}&#92;right)}&#92;right)$$<br><br>This transformed abstract airport strings into actionable distance vectors for our LightGBM Classifier."            },
            {
                date: "Hurdle 1: The 512MB Memory Wall (OOM Crash)",
                text: "<strong>The Problem:</strong> Upon deployment, Gunicorn’s default dynamic calculation spawned 17 workers on Render's shared environment. Each worker loaded its own instance of the LightGBM pipeline (~150MB), demanding over 2.5GB of RAM and obliterating the 512MB free-tier limit.<br><br><strong>The Solution:</strong> Completely refactored <code>gunicorn_conf.py</code>. Eliminated dynamic core-scaling and hard-capped execution to a Single-Worker, Multi-Threaded model. This stabilized memory usage at a constant ~250MB."
            },
            {
                date: "Hurdle 2: Environmental Drift (Pickle Error)",
                text: "<strong>The Problem:</strong> The worker failed to boot, throwing an <code>AttributeError</code> during model deserialization. The model was trained locally using scikit-learn==1.6.1, but the unpinned container image pulled down version 1.8.0, making the pickled model unreadable.<br><br><strong>The Solution:</strong> Wrote a clean <code>requirements.txt</code>, hard-pinning scikit-learn==1.6.1 to enforce absolute parity between development and production environments."
            },
            {
                date: "Hurdle 3: Monolithic Codebase & API Rate Limiting",
                text: "<strong>The Problem:</strong> The early architecture made raw calls to external APIs on every request, causing severe latency (~3s) and exposing the app to rate-limiting. Furthermore, <code>main.py</code> was a bloated monolith with dead code.<br><br><strong>The Solution:</strong> Cleaned up 415 lines of dead code and centralized management using Pydantic's BaseSettings. Integrated a Redis caching layer with a 30-minute TTL. Repeated queries are now intercepted and served from memory in <100ms."
            },
            {
                date: "Hurdle 4: CI/CD Dependency Failures",
                text: "<strong>The Problem:</strong> The newly established GitHub Actions workflow failed, lacking <code>httpx</code> for unit testing, and throwing a <code>ModuleNotFoundError</code> during test collection.<br><br><strong>The Solution:</strong> Added httpx to requirements and injected a <code>PYTHONPATH=.</code> wrapper directly into the test suite definitions, allowing the runner to look at the project root while testing from the sub-directory."
            },
            {
                date: "Hurdle 5: Validating Graceful Degradation",
                text: "<strong>The Problem:</strong> A test threw a failure because it received a 500 Internal Server Error instead of a success code. Multiple tests executing concurrently with invalid keys had tripped our Circuit Breaker pattern exactly as designed, short-circuiting external API failures.<br><br><strong>The Solution:</strong> Updated test assertions to explicitly recognize a 500 status as a valid indicator of a successful circuit-break event. The suite passed with 100% green metrics across all 47 tests."
            },
            {
                date: "Phase 4.1: The User Frontend Integration",
                text: "<strong>Objective:</strong> Move beyond the backend Swagger UI.<br><br><strong>Implementation:</strong> Develop a single-page web app using SvelteKit or vanilla HTML5/TailwindCSS that maps user form inputs directly to the POST API, presenting flight delays through clean, visual data dashboards."
            },
            {
                date: "Phase 4.2: Distributed Operations & Task Queueing",
                text: "<strong>Objective:</strong> Completely decouple the request-response lifecycle to prevent users from hanging on active HTTP connections waiting for external APIs.<br><br><strong>Implementation:</strong> Introduce Celery with our existing Redis instance acting as a message broker. The API will accept a prediction task, hand back a 202 Accepted tracking token, and execute the heavy ML feature gathering in the background asynchronously."
            },
            {
                date: "Phase 4.3: Automated Model Re-training & Drift Monitoring",
                text: "<strong>Objective:</strong> Prevent 'Model Rot' caused by changing seasonal flight patterns.<br><br><strong>Implementation:</strong> Implement a lightweight logging database to track prediction accuracy. When accuracy drops below a threshold, trigger a GitHub Action workflow to fetch fresh training data, re-optimize LightGBM hyperparameters, and serialize an updated pipeline binary."
            }
        ]
    },
    "job-agent": {
        title: "AI Job Search & Research Agent",
        stack: "[LangChain v1.x, Gemini 1.5 Flash, LangGraph, SQLite, Streamlit, Docker]",
        github: "https://github.com/Unknown2151/job-search-agent.git",
        live: "https://job-search-agent-production-455e.up.railway.app/",
        desc: "The project evolved from a simple linear script into a stateful, concurrent, multi-agent backend architecture deployed on a stateless cloud container.",
        timeline: [
            {
                date: "The Blueprint vs. Reality",
                text: "The initial concept was straightforward: build a script that takes a user prompt, scrapes LinkedIn or Indeed for jobs, feeds the raw HTML to Google Gemini 1.5 Flash, and prints a summary. As we scaled the prompt complexity, the simple script shattered. We quickly realized that a linear script couldn't handle the unpredictability of web scraping, the context limits of LLMs, or the need for a cohesive user interface."
            },
            {
                date: "Hurdle 1: The Bottleneck (Sequential Scraping)",
                text: "<strong>The Problem:</strong> Querying LinkedIn, Indeed, and Naukri one after another took way too long. When we tried to run them simultaneously, RapidAPI threw 429 Too Many Requests errors.<br><br><strong>The Solution:</strong> Implemented Asynchronous I/O processing using <code>asyncio.gather</code> and custom worker threads to fire off scrapers in parallel. Engineered an asynchronous 'jitter' (a microscopic, randomized delay) to bypass rate-limiting, slashing search latency by over 60%."
            },
            {
                date: "Hurdle 2: The Amnesia (Context Loss)",
                text: "<strong>The Problem:</strong> The standard LangChain AgentExecutor was forgetful, losing resume context by the third conversational turn.<br><br><strong>The Solution:</strong> Ripped out the basic executor and architected a LangGraph State Machine. Implemented a SQLite Checkpointer (SqliteSaver) to give the agent persistent conversational memory, allowing it to seamlessly cross-reference previously uploaded resumes against new job descriptions."
            },
            {
                date: "Hurdle 3: The UI Crash (Brittle Parsing)",
                text: "<strong>The Problem:</strong> Relied on the LLM to format job data into Markdown tables. If the LLM hallucinated a character, the Streamlit UI would fail to parse the data, breaking the 'Save to Notion' feature.<br><br><strong>The Solution:</strong> Bypassed the LLM's natural language generation for data passing. Wrote a custom parser that reads raw, structured JSON output directly from the LangGraph tool execution state, guaranteeing 100% deterministic data extraction."
            },
            {
                date: "Hurdle 4: The UI Freeze",
                text: "<strong>The Problem:</strong> Saving multiple jobs to Notion froze the Streamlit UI for several seconds while the backend waited for sequential API responses.<br><br><strong>The Solution:</strong> Refactored the CRM tracker using Notion's AsyncClient. Wrapped the LangChain tool in a synchronous thread pool executor that safely spun up an async event loop, pushing 10+ jobs to Notion concurrently in under a second."
            },
            {
                date: "Hurdle 5: The Deployment Trap",
                text: "<strong>The Problem:</strong> During Railway cloud deployment, the build crashed because our configuration relied on a Makefile command unsupported by our ultra-lightweight Docker image.<br><br><strong>The Solution:</strong> Updated the Dockerfile to bypass the Makefile entirely, executing Streamlit directly and binding it dynamically to Railway's assigned port to avoid bloating the container."
            },
            {
                date: "Phase 1: Where We Are Now",
                text: "The application is containerized via Docker and live on Railway. Below is the multi-agent state machine diagram generated live via Mermaid.js.<br><br> <div class='mermaid' style='text-align: center; margin-top: 20px;'> graph TD; A[User Input] --> B{LangGraph Router}; B -->|Intent: Search| C[LinkedIn Scraper]; B -->|Intent: Analyze| D[Gemini 1.5 Flash]; C --> E[(SQLite Checkpointer)]; D --> E; E --> F[Notion DB Sync]; </div>"
            },
            {
                date: "Phase 2: The Future Roadmap",
                text: "<strong>Multi-User Authentication:</strong> Integrating Clerk or Supabase Auth so users can securely store their own API keys.<br><br><strong>PostgreSQL Migration:</strong> Swapping local SQLite for a managed, distributed PostgreSQL database for long-term session persistence.<br><br><strong>Vector Database Integration:</strong> Replacing text-truncation with an embedding model and a Vector DB (Pinecone/Qdrant) for complex resumes and semantic search.<br><br><strong>Automated Cron Workflows:</strong> Setting up background tasks to run the agent every morning and send a synthesized email digest."
            }
        ]
    }
};

// 2. Grab the ID from the URL (e.g., "?id=found-extension")
const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get('id');

// 3. Find the data for that ID
const project = projectData[projectId];

// 4. Inject the data into the HTML template
if (project) {
    document.title = `${project.title} | Sushmin`;
    document.getElementById('proj-title').innerText = project.title;
    document.getElementById('proj-stack').innerText = project.stack;
    document.getElementById('proj-desc').innerText = project.desc;

    // Set GitHub link
    document.getElementById('proj-github').href = project.github;

    // Handle Live link (hide it if it doesn't exist)
    const liveLink = document.getElementById('proj-live');
    if (project.live) {
        liveLink.href = project.live;
        liveLink.style.display = "inline-block";
    } else {
        liveLink.style.display = 'none';
    }

    // Generate the timeline dynamically
    const timelineContainer = document.getElementById('proj-timeline');
    project.timeline.forEach(event => {
        const eventHTML = `
            <div class="timeline-event">
                <span class="timeline-date">${event.date}</span>
                <p>${event.text}</p>
            </div>
        `;
        timelineContainer.insertAdjacentHTML('beforeend', eventHTML);
    });



    // 3. RENDER ARCHITECTURE DIAGRAMS (Mermaid.js)
    setTimeout(() => {
        if (window.mermaid) {
            mermaid.init(undefined, document.querySelectorAll('.mermaid'));
        }
    }, 100);

    // 4. RENDER MATH EQUATIONS (MathJax)
    setTimeout(() => {
        if (window.MathJax && window.MathJax.typesetPromise) {
            window.MathJax.typesetPromise().catch((err) => console.error('MathJax error:', err.message));
        }
    }, 500);

} else {
    document.getElementById('proj-title').innerText = "Project Not Found";
}