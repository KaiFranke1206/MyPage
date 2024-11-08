class CPU:
    def __init__(self):
        self.pc = 0       # Program Counter
        self.sp = 0xFF    # Stack Pointer
        self.acc = 0      # Accumulator
        self.xreg = 0     # X Register
        self.yreg = 0     # Y Register
        # Flags
        self.c = False    # Carry Flag
        self.z = False    # Zero Flag
        self.i = False    # Interrupt Disable Flag
        self.d = False    # Decimal Mode Flag
        self.b = False    # Break Command Flag
        self.v = False    # Overflow Flag
        self.n = False    # Negative Flag

    def reset(self):
        """Resets the CPU to its initial state."""
        self.pc = 0
        self.sp = 0xFF
        self.acc = self.xreg = self.yreg = 0
        self.c = self.z = self.i = self.d = self.b = self.v = self.n = False

    def set_flags(self, value):
        """Sets Zero and Negative flags based on the given value."""
        self.z = (value == 0)
        self.n = (value & 0x80) != 0

    def execute_instruction(self, opcode, mem):
        """Executes a single instruction based on the provided opcode."""
        if opcode == 0x69:  # ADC Immediate
            value = mem.read_byte(self.pc + 1)
            self.adc(value)
            self.pc += 2
        elif opcode == 0x65:  # ADC Zero Page
            address = mem.read_byte(self.pc + 1)
            value = mem.read_byte(address)
            self.adc(value)
            self.pc += 2
        else:
            raise NotImplementedError(f"Unknown Opcode {opcode:02X}")

    def adc(self, value):
        """Performs ADC (Add with Carry) operation."""
        carry_in = 1 if self.c else 0
        result = self.acc + value + carry_in
        self.c = result > 0xFF
        result &= 0xFF
        self.v = ((self.acc ^ result) & (value ^ result) & 0x80) != 0
        self.acc = result
        self.set_flags(self.acc)

        print(f"*ACTION* Accumulator updated to {self.acc:02X} after ADC {value:02X}")

class Mem:
    def __init__(self):
        self.ram = [0] * 65536  # 64KB of memory

    def read_byte(self, address):
        """Reads a byte from the specified memory address."""
        return self.ram[address % 65536]

    def write_byte(self, address, value):
        """Writes a byte to the specified memory address."""
        self.ram[address % 65536] = value & 0xFF

    def load_program(self, program, start_address=0x00):
        """Loads a program into memory starting at the given address."""
        for i, byte in enumerate(program):
            self.write_byte(start_address + i, byte)

# Example usage
cpu = CPU()
mem = Mem()

# Load a program to test ADC Immediate and Zero Page addressing modes
program = [
    0x69, 0x10,  # ADC #$10 (Immediate)
    0x65, 0x02   # ADC $02 (Zero Page)
]
mem.load_program(program)
mem.write_byte(0x02, 0x20)  # Set value at zero page address 0x02

# Execute the program
while cpu.pc < len(program):
    opcode = mem.read_byte(cpu.pc)
    cpu.execute_instruction(opcode, mem)
