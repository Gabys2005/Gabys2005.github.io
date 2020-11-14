let data = localStorage.getItem("lastCode");
let individualVotes = [["Username", "Votes"]]

if (data) {
	document.getElementById("autocompleteText").style.display = "block"
}

document.getElementById("generatedCode").value = data

function generateResults() {
	data = JSON.parse(document.getElementById("generatedCode").value);
	localStorage.setItem("lastCode", JSON.stringify(data))
	showResults()
}

async function showResults() {
	console.log(data)

	const votingOptions = data[0];
	data.shift()

	var results = []
	var totalPoints = 0

	document.getElementById("insertCode").style.display = "none";
	document.getElementById("main").style.display = "block"

	votingOptions.forEach((element, i) => {
		results.push({id: i+1, name: element, points: 0})
	})

	data.forEach(element => {
		var username = element[0]
		element.shift()
		var tr = document.createElement("tr")
		var td = document.createElement("td")
		td.innerText = username
		tr.appendChild(td)
		var td = document.createElement("td")
		var toAddToIndividual = [username]
		element.forEach(element2 => {
			results.find(r => r.id == element2).points += 1
			totalPoints += 1
			td.innerText += ", " + results.find(r => r.id == element2).name
			toAddToIndividual.push(results.find(r => r.id == element2).name)
		})
		individualVotes.push(toAddToIndividual)
		td.innerText = td.innerText.substring(2)
		tr.appendChild(td)
		document.getElementById("individualVotes").appendChild(tr)
	})

	results.sort(function(a,b) {
		return b.points - a.points
	})

	results.forEach((element,i) => {
		var tr = document.createElement("tr")
		var td = document.createElement("td")
		td.innerText = element.name
		td.id = "option" + element.id + "Name"
		tr.appendChild(td)
		var td = document.createElement("td")
		td.innerText = element.points
		td.id = "option" + element.id + "Points"
		tr.appendChild(td)
		var td = document.createElement("td")
		td.innerText = Math.round(((element.points/totalPoints*100) + Number.EPSILON) * 100) / 100
		td.id = "option" + element.id + "Percent"
		tr.appendChild(td)
		document.getElementById("resultsTable").appendChild(tr)
		document.getElementById("resultsToCopy").value += i+1 + ". " + element.name + " - " + element.points + " " + replacePointsWithRight(element.points) + " " + addTrophies(i+1) + "\n"

		var startSpaceAmount = "   "
		if (i+1 > 9) {
			startSpaceAmount = "  "
		} else if (i+1 > 99) {
			startSpaceAmount = " "
		} else if (i+1 > 999) {
			startSpaceAmount = ""
		}
		var middleSpaceAmount = "     "
		if (element.points > 9) {
			middleSpaceAmount = "    "
		} else if (element.points > 99) {
			middleSpaceAmount = "   "
		} else if (element.points > 999) {
			middleSpaceAmount = "  "
		} else if (element.points > 9999) {
			middleSpaceAmount = " "
		} else if (element.points > 99999) {
			middleSpaceAmount = ""
		}

		document.getElementById("resultsMarkdown").value += `\n${startSpaceAmount}${i+1}. | ${middleSpaceAmount}${element.points} | ${element.name} ${addTrophies(i+1)}`
	})
	document.getElementById("resultsMarkdown").value += `\n\`\`\``
}

function downloadAsExcel() {
	return ExcellentExport.convert({ anchor: document.getElementById("excelDownload"), filename: 'results', format: 'xlsx'},
		[{name: 'General Results', from: {table: 'resultsTable'}}, 
		{name: 'Individual Votes', from: {array: individualVotes}}]);
}

function replaceThWithRight(num) {
	if (num == 1) {
		return "st"
	} else if (num == 2) {
		return "nd"
	} else if (num == 3) {
		return "rd"
	} else {
		return "th"
	}
}
function replacePointsWithRight(num) {
	if (num == 1) {
		return "pt."
	} else {
		return "pts."
	}
}
function addTrophies(num) {
	if (num == 1) {
		return "🥇"
	} else if (num == 2) {
		return "🥈"
	} else if (num == 3) {
		return "🥉"
	} else {
		return ""
	}
}