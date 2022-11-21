var Calendar = require('node-google-calendar'),
    config = require('./calendar-config'),
    calId = config.calendarId.myCal;
var cal = new Calendar(config);

function getPAAMonthList(year, month, durmonth) {
    if (parseInt(parseInt(month) + parseInt(durmonth)) <= 12) {
        var params = {
            timeMin: parseInt(year) + '-' + month + '-01T00:00:00+09:00',
            timeMax: parseInt(year) + '-' + parseInt(parseInt(month) + parseInt(durmonth)) + '-01T00:00:00+09:00',
            singleEvents: true,
            orderBy: "startTime"
        }
    } else {
        var params = {
            timeMin: parseInt(year) + '-' + month + '-01T00:00:00+09:00',
            timeMax: parseInt(parseInt(year) + 1) + '-' + parseInt(parseInt(month) + parseInt(durmonth) - 12) + '-01T00:00:00+09:00',
            singleEvents: true,
            orderBy: "startTime"
        }
    }

    cal.Events.list(calId, params)
        .then(calEvents => {
            var paa = calEvents.filter(event => {
                if (event.summary) {
                    return event.summary.match(/PAA/)
                }
            })
            var nameList = []
            paa.forEach(element => {
                if (nameList.map(item => item.name).includes(element.summary.split(" ")[1])) {

                } else {
                    nameList.push({
                        name: element.summary.split(" ")[1],
                        classNum: 0
                    })
                }
            });
            nameList.forEach(student => {
                paa.filter(event => event.summary.match(student.name)).forEach(event => {
                    student.classNum += (new Date(event.end.dateTime).getTime() - new Date(event.start.dateTime).getTime()) / (1000 * 60 * 60 * 1.5)
                })
            })
            console.log(nameList)

        })
        .catch(err => {
            console.log(err.message);
        });
}

getPAAMonthList(process.argv[2], process.argv[3], process.argv[4])