# main.py: A basic CPU simulator

class CPU:
    def __init__(self):
        self.registers = {'R1': 0, 'R2': 0, 'R3': 0}
        self.ram = [0] * 10  # Example RAM with 10 memory cells
        self.pc = 0  # Program counter
        self.instructions = []
        self.running = True

    def load_instructions(self, instructions):
        """Loads instructions into the CPU."""
        self.instructions = instructions.splitlines()

    def execute_next(self):
        """Executes the next instruction and updates the CPU state."""
        if self.pc >= len(self.instructions) or not self.running:
            self.running = False
            return {'registers': self.registers.copy(), 'ram': self.ram.copy(), 'pc': self.pc}

        current_instruction = self.instructions[self.pc].strip().split()
        if not current_instruction:
            self.pc += 1
            return self.get_state()

        operation = current_instruction[0].upper()

        if operation == 'LOAD':
            reg, value = current_instruction[1], int(current_instruction[2])
            self.registers[reg] = value

        elif operation == 'STORE':
            reg, address = current_instruction[1], int(current_instruction[2])
            self.ram[address] = self.registers[reg]

        elif operation == 'ADD':
            reg1, reg2 = current_instruction[1], current_instruction[2]
            self.registers[reg1] += self.registers[reg2]

        elif operation == 'SUB':
            reg1, reg2 = current_instruction[1], current_instruction[2]
            self.registers[reg1] -= self.registers[reg2]

        elif operation == 'JMP':
            address = int(current_instruction[1])
            self.pc = address
            return self.get_state()

        elif operation == 'HALT':
            self.running = False

        self.pc += 1
        return self.get_state()

    def get_state(self):
        """Returns the current state of the CPU."""
        return {
            'registers': self.registers.copy(),
            'ram': self.ram.copy(),
            'pc': self.pc
        }

def run_simulation(input_code):
    """Runs the simulation step-by-step and returns the state after each instruction."""
    cpu = CPU()
    cpu.load_instructions(input_code)
    states = []

    while cpu.running:
        state = cpu.execute_next()
        states.append(state)

    return states