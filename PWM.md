# Pulse Width Modulation (PWM)

## Terms

- Frequency: How many time is occurred, from logical high to low and back to high, within a second. Unit: Hz.
- Period: T=1/Frequency. Unit: Millisecond, Microsecond.
- Duty: The ratio of logical high within a peroid. Unit: Percentage.

- Clock: Generate frequency. Type of clock: external crystal, phase locked loop (PLL), oscillator.
- Timer: Consist of divider and counter. Divider is used to reduce high frequency to lower frequency by division. Counter value increase by one on every divided pulse of selected clock. 
- PWM Generator: Counter value from selected timer. Logical high once counter value reached high point and Logical low once counter value reached low point. Low point value may be changed after counter overflow. Also, interruption may be occurred when overflow.

PWM frequency is affected by clock frequency, divider and counter resolution. 

### For ESP32
`Frequency(pwm) = Frequency(Clock) / (Divider * 2^resolution)`

Clock: 40MHz
Divider: 8
Resolution: 10
PWM: 4882Hz

`Resolution = log2(Frequency(Clock) / (Frequency(pwm) * Divider))`

Clock: 40MHz
Divider: 8
PWM: 4882Hz
Resolution: 10