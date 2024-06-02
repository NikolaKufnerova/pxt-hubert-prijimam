radio.setFrequencyBand(72)
radio.setTransmitPower(5)
radio.setGroup(73)
radio.setTransmitSerialNumber(true)

basic.showLeds(`
. # # . .
. # # # .
. # # # #
. # . . .
. # . . .
`)

let strip = neopixel.create(DigitalPin.P16, 9, NeoPixelMode.RGB)
strip.setPixelColor(0, neopixel.colors(neopixel.hsl(0, 99, 50,)))
strip.showColor(neopixel.rgb(255, 0, 0))
strip.show()

// basic.forever(function () {
//     PCAmotor.GeekServo(PCAmotor.Servos.S1, 800)
//     basic.pause(8000)
//     PCAmotor.GeekServo(PCAmotor.Servos.S1, 2200)
//     basic.pause(8000)
// })

type Protokol = {
    x: number; //smer
    y: number; //rychlost
}

let letter: string

radio.onReceivedString(function (receivedString: string) {
    letter = receivedString

    let data: Protokol = {
        x: parseInt(letter.split(";")[0]),
        y: parseInt(letter.split(";")[1])
    }

    let turns = Math.map(data.x, -1024, 1024, -120, 120)
    let run = Math.map(data.y, -1024, 1024, -255, 255)

    const runMotors = (motor1: PCAmotor.Motors, motor1Speed: number, motor2: PCAmotor.Motors, motor2Speed: number) => {
        PCAmotor.MotorRun(motor1, motor1Speed)
        PCAmotor.MotorRun(motor2, motor2Speed)
    }

    let motor1Speed = 0
    let motor2Speed = 0

    if (data.x <= 0) {
        motor1Speed = -run
        if (data.y >= 0) {
            motor2Speed = run - turns
        } else {
            motor2Speed = run + turns
        }
        runMotors(PCAmotor.Motors.M1, motor1Speed, PCAmotor.Motors.M4, motor2Speed)
    } else {
        motor2Speed = run
        if (data.y >= 0) {
            motor1Speed = -run - turns
        } else {
            motor1Speed = -run + turns
        }
        runMotors(PCAmotor.Motors.M4, motor2Speed, PCAmotor.Motors.M1, motor1Speed)
    }
})