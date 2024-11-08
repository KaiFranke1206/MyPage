document.addEventListener('DOMContentLoaded', async () => {
    try {
        const pyodide = await loadPyodide();
        console.log('Pyodide loaded successfully.');

        // Load main.py script into Pyodide
        const response = await fetch('main.py');
        if (!response.ok) {
            throw new Error('Failed to fetch main.py');
        }
        const mainScript = await response.text();
        await pyodide.runPythonAsync(mainScript);
        console.log('main.py loaded into Pyodide.');

        document.getElementById('clockSpeed').addEventListener('input', (e) => {
            document.getElementById('clockSpeedValue').innerText = `${e.target.value} ms`;
        });

        document.getElementById('runButton').addEventListener('click', async () => {
            const codeInput = document.getElementById('codeInput').value;
            const clockSpeed = document.getElementById('clockSpeed').value;
            const registersOutput = document.getElementById('registersOutput');
            const ramOutput = document.getElementById('ramOutput');
            const pcOutput = document.getElementById('pcOutput');

            try {
                // Run the simulation and get the states
                let simulationStates = await pyodide.runPythonAsync(`
run_simulation("""${codeInput}""")
                `);

                for (const state of simulationStates) {
                    // Display the current CPU state
                    registersOutput.innerText = `Registers: ${JSON.stringify(state['registers'])}`;
                    ramOutput.innerText = `RAM: ${JSON.stringify(state['ram'])}`;
                    pcOutput.innerText = `Program Counter: ${state['pc']}`;

                    // Wait for the clock speed interval
                    await new Promise(resolve => setTimeout(resolve, clockSpeed));
                }
            } catch (error) {
                console.error('Error during simulation:', error);
                registersOutput.innerText = `Error: ${error.message}`;
            }
        });
    } catch (error) {
        console.error('Initialization error:', error);
        alert('Failed to initialize Pyodide or load main.py. Please try again.');
    }
});