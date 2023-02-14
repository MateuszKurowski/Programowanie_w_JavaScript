export class Background {
	constructor(context, width, rectAmountInRow) {
		this.context = context
		this.xPosition = 0
		this.yPosition = 0
		this.rectAmountInRow = rectAmountInRow % 2 == 0 ? rectAmountInRow : rectAmountInRow + 1
		this.rectSize = width / rectAmountInRow
		this.colorsRows = []
		for (let i = 1; i <= this.rectAmountInRow; i++) {
			const row = []
			for (let j = 1; j <= this.rectAmountInRow; j++) {
				const color = []
				color.push(Math.round(Math.abs(Math.sin((Date.now() * i) / 50)) * 50))
				color.push(Math.round(Math.abs(Math.sin((Date.now() * i) / 200)) * 50))
				color.push(Math.round((this.b = Math.abs(Math.sin((Date.now() * i) / 100)) * 50)))
				row.push(color)
			}
			this.colorsRows.push(row)
		}
	}

	draw() {
		this.xPosition = 0
		this.yPosition = 0
		for (let i = 0; i < this.rectAmountInRow; i++) {
			for (let j = 0; j < this.rectAmountInRow; j++) {
				this.context.fillStyle = `rgb(${this.colorsRows[i][j][0]}, ${this.colorsRows[i][j][1]}, ${this.colorsRows[i][j][2]})`
				this.context.fillRect(this.xPosition, this.yPosition, this.rectSize, this.rectSize)
				this.xPosition += this.rectSize
			}
			this.xPosition = 0
			this.yPosition += this.rectSize
		}
	}
}
