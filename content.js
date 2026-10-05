export const courses = [
  {subject:'BWL',name:'Einführung in die Betriebswirtschaftslehre',area:'Wirtschaft',material:'Grundlagen-Beispiele vorhanden'},
  {subject:'VWL',name:'Einführung in die Volkswirtschaftslehre und Grundlagen der Mikroökonomik',area:'Wirtschaft',material:'Skript noch nicht eingearbeitet'},
  {subject:'Statistik',name:'Statistik',area:'Methoden',material:'Grundlagen-Beispiele und Rechner vorhanden'},
  {subject:'Mathematik',name:'Mathematik',area:'Methoden',material:'Skript noch nicht eingearbeitet'},
  {subject:'Marketing',name:'Marketing',area:'Wirtschaft',material:'Skript noch nicht eingearbeitet'},
  {subject:'Finanzbuchführung',name:'Finanzbuchführung',area:'Wirtschaft',material:'Skript noch nicht eingearbeitet'},
  {subject:'Operationsmanagement',name:'International Operationsmanagement',area:'Management',material:'Skript noch nicht eingearbeitet'},
  {subject:'Konstruktion & Werkstoffe',name:'Konstruktion & Werkstoffe',area:'Technik',material:'Skript noch nicht eingearbeitet'},
  {subject:'Kinematik & Statik',name:'Kinematik, Statik',area:'Technik',material:'Skript noch nicht eingearbeitet'}
];
// Technik bleibt als allgemeines Lerngebiet für ältere Backups verfügbar.
export const subjects = [...courses.map(course=>course.subject),'Technik'];
export const cards = [
  {id:'bwl-1',subject:'BWL',question:'Was ist Umsatz?',answer:'Umsatz ist der Erlös aus verkauften Leistungen: Absatzmenge × Verkaufspreis. Er sagt allein noch nichts über den Gewinn aus.'},
  {id:'bwl-2',subject:'BWL',question:'Was ist Gewinn?',answer:'In unserem vereinfachten Rechenmodell: Umsatz − Gesamtkosten. In der Erfolgsrechnung werden Erträge und Aufwendungen gegenübergestellt.'},
  {id:'bwl-3',subject:'BWL',question:'Was unterscheidet fixe und variable Kosten?',answer:'Fixe Kosten bleiben im betrachteten Beschäftigungsbereich unverändert. Variable Kosten ändern sich mit der produzierten oder verkauften Menge.'},
  {id:'bwl-4',subject:'BWL',question:'Was ist der Deckungsbeitrag je Stück?',answer:'Verkaufspreis je Stück − variable Kosten je Stück. Er trägt zur Deckung der Fixkosten und danach zum Gewinn bei.'},
  {id:'bwl-5',subject:'BWL',question:'Was ist die Break-even-Menge?',answer:'Die Menge, bei der Umsatz und Gesamtkosten gleich sind. Im linearen Modell: Fixkosten ÷ (Preis − variable Stückkosten), sofern der Stückdeckungsbeitrag positiv ist.'},
  {id:'bwl-6',subject:'BWL',question:'Was sind Ressourcen eines Unternehmens?',answer:'Mittel, die ein Unternehmen für seine Aufgaben nutzt, etwa Arbeitskräfte, Zeit, Kapital, Materialien und Wissen.'},
  {id:'stat-1',subject:'Statistik',question:'Was ist die absolute Häufigkeit?',answer:'Die Anzahl, wie oft eine Ausprägung in den beobachteten Daten vorkommt.'},
  {id:'stat-2',subject:'Statistik',question:'Wie berechnet man die relative Häufigkeit?',answer:'Absolute Häufigkeit ÷ Gesamtzahl der Beobachtungen. Alle relativen Häufigkeiten zusammen ergeben 1 beziehungsweise 100 %.'},
  {id:'stat-3',subject:'Statistik',question:'Was ist der Median?',answer:'Der mittlere Wert der sortierten Daten. Bei gerader Anzahl ist es das arithmetische Mittel der beiden mittleren Werte.'},
  {id:'stat-4',subject:'Statistik',question:'Was ist der Modus?',answer:'Die am häufigsten auftretende Ausprägung. Mehrere Werte können gleich häufig sein. In diesem Hub nennen wir bei ausschließlich einmaligen Werten keinen Modus.'},
  {id:'stat-5',subject:'Statistik',question:'Was misst die Standardabweichung?',answer:'Sie beschreibt die Streuung um den Mittelwert und ist die Quadratwurzel der Varianz. Sie hat dieselbe Einheit wie die ursprünglichen Werte.'},
  {id:'stat-6',subject:'Statistik',question:'Wann teilt die Varianzformel durch n − 1?',answer:'Bei der korrigierten Stichprobenvarianz als Schätzer der Populationsvarianz. Für die deskriptive Varianz der gesamten betrachteten Daten wird durch n geteilt.'}
];
export const quiz = [
  {subject:'BWL',question:'Du verkaufst 20 Stück zu je 15 €. Wie hoch ist der Umsatz?',options:['300 €','15 €','20 €','35 €'],correct:0,explanation:'Umsatz = 20 × 15 € = 300 €. Kosten werden erst bei der Gewinnberechnung berücksichtigt.'},
  {subject:'BWL',question:'Umsatz 800 €, Gesamtkosten 650 €: Wie hoch ist der Gewinn im vereinfachten Modell?',options:['1.450 €','150 €','650 €','800 €'],correct:1,explanation:'Gewinn = Umsatz − Gesamtkosten = 150 €.'},
  {subject:'BWL',question:'Preis 30 €, variable Stückkosten 18 €: Wie hoch ist der Stückdeckungsbeitrag?',options:['48 €','18 €','12 €','30 €'],correct:2,explanation:'30 € − 18 € = 12 € zur Deckung der Fixkosten und danach für den Gewinn.'},
  {subject:'BWL',question:'Fixkosten 120 €, Stückdeckungsbeitrag 12 €: Wo liegt der Break-even?',options:['10 Stück','12 Stück','120 Stück','1.440 Stück'],correct:0,explanation:'120 € ÷ 12 € je Stück = 10 Stück.'},
  {subject:'Statistik',question:'Welche Zahl ist der Median von 2, 3, 9?',options:['2','9','14/3','3'],correct:3,explanation:'Sortiert steht die 3 in der Mitte. Der Mittelwert wäre 14/3.'},
  {subject:'Statistik',question:'Ein Wert tritt 4-mal bei 20 Beobachtungen auf. Wie groß ist seine relative Häufigkeit?',options:['4 %','20 %','80 %','5 %'],correct:1,explanation:'4 ÷ 20 = 0,2 = 20 %.'},
  {subject:'Statistik',question:'Alle Messwerte sind gleich. Was gilt für die Standardabweichung?',options:['Sie ist 1.','Sie ist negativ.','Sie ist 0.','Sie ist immer undefiniert.'],correct:2,explanation:'Es gibt keine Abweichungen vom Mittelwert, deshalb sind Varianz und Standardabweichung 0.'},
  {subject:'Statistik',question:'Was beeinflussen einzelne sehr große Ausreißer typischerweise stärker?',options:['Den Mittelwert','Den Median','Beide bleiben unverändert','Die Anzahl der Werte wird kleiner'],correct:0,explanation:'Der Mittelwert berücksichtigt die Größe jedes Werts. Der Median orientiert sich an der Position in der sortierten Reihe.'}
];
export const links = [
  {name:'Moodle',tag:'Lernplattform',description:'Kurse, Skripte und Hinweise deiner Lehrenden.',url:'https://moodle.dhbw-vs.de/'},
  {name:'DUALIS',tag:'Studienverwaltung',description:'Prüfungsergebnisse und Leistungsübersicht.',url:'https://dualis.dhbw.de/'},
  {name:'Hochschul-Mail',tag:'Modoboa',description:'Dein studentisches E-Mail-Postfach.',url:'https://modoboa.dhbw-vs.de/'},
  {name:'IT-Dienste',tag:'Zugänge & Hilfe',description:'Offizielle Hinweise zu VPN, WLAN und Benutzerkonten.',url:'https://www.dhbw-vs.de/studierende/serviceeinrichtungen/it-service-center/its-dienste.html'},
  {name:'Software-Angebote',tag:'Werkzeuge',description:'Informationen zu MATLAB, Office, DATEV und weiteren Angeboten.',url:'https://www.dhbw-vs.de/studierende/serviceeinrichtungen/it-service-center/software.html'},
  {name:'Studienstart',tag:'Orientierung',description:'Offizielle Anlaufstellen zum Start an der DHBW VS.',url:'https://www.dhbw-vs.de/studierende/studienstart.html'}
];
