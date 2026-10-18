# Bean Local Setup

1. Open Terminal in the `bean_local` folder.
2. Run:

```bash
npm start
```

3. Open `http://localhost:3000`.

## Test API
Open Coffee Finder / Cafés. "Melbourne Coffee Weather" should display live Open-Meteo data.

## Test Chart.js
The Community Coffee Ratings chart should display current BeanList ratings. Add, update or delete a coffee and the chart should refresh.

## Test text-file storage
Open Contact, enter valid Name, Email and Message values, then click Send Feedback.
A new record should be appended to `data/feedback.txt`.

The Contact information panel also reads the text file indirectly and displays the saved record count.


## Test Coffee Finder persistence
Run `npm start`, open Coffee Finder, add `ONA cherry`, then refresh the page.
The new coffee should still appear. Check `data/coffees.txt` to see the saved record.
Update and Delete are saved in the same way.
