# Starten des Projekts

cd KLIENT
npm start

cd server
npm start

# Zusammenfassung Projekt UNO
Die Idee war den Klassiker UNO in einer Webapp umzusetzen, da wir nach Mensch Ärgere Dich Nicht alle sehr gerne Karten spielen und gleich an das gedacht haben. 

## Die unednliche Entstehungsgeschichte
Wir wollten umbedingt react für das Projekt verwenden. Leider war das ehrlich gesagt seit Anfang an eine große Herauforderung für uns. Nach der Einheit mit Partykit im Unterricht, dachten wir, es wäre doch mal spannend, das mit partykit umzusetzen. Das war unser erster Ansatz. Nach dem Gespräch im Unterricht, haben wir dann versucht, alles in eine react App zu verpacken, was uns leider nicht ganz so gut gelungen ist. Darum haben wir Sie um Hilfe gebeten. Als dritten Ansatz haben wir das Git-template von Ihnen anpassen wollen. React mit context, state und wie die ganzen Files miteinander verknüpft sind, war für uns eine große Herausforderung und wir konnten das mit unserem Wissen nicht funktionstüchtig machen. Darum wir uns schließlich für eine neu aufgesetzte React app mit Socket.io entschieden. Hier waren für uns die Kommunikation und Verknüpfungspunkte einfacher zu verstehen und daraus entwickelte sich das jetzige Projekt.

## Probleme und verzweifelte git commits
Abgesehen der generellen Probleme mit React, haben wir sehr viele Probleme mit unserer users list gehabt. Zuerst haben wir nämlich alle Spieler nur mit der Socket.id ansprechen. Dabei machte uns der Reload über die login page immer einen Strich durch die Rechnung. Wir haben jetzt noch keinen funktionierenden Weg gefunden, die users gemeinsam mit den Usernames zu managen, aber die grundsätzlichen Funktionen von Uno sind über die socket.id nun möglich.

Auch das Testing und das CI war für uns Neuland und wir hatten bis zum bitteren Endspurt noch einige Probleme bei der Implementierung. Die Testings beschränken sich leider nun wirklich auf das Notwendigste, da uns diese Aufgabe nicht sonderlich gut gelungen ist.


# Authorization
Als Authorization haben wir Auth0 verwendet, da uns das im Unterricht am meisten zugesagt hat. Es wirkte sehr unkompliziert, ist schön erklärt auf der website und hat viele tutorials dazu. Wir haben direkt am Anfang einen Login mit Authorization eingebaut, ohne welchen das Spiel nicht gespielt werden kann. Für eine direkte URL Eingabe des Spiels wurde ebenfalls eine NavigateTo eingebaut, damit zuerst der login erfolgt. 

# Client server communication
Wie bereits erwähnt starteten wir ein Projekt mit React und Socket.io für die Echtzeit Kommunikation bei den Spieler und beispielsweise dem Ablagestapel. Mit den tutorials und der guten Dokumentation ist uns die Kommunikation auch einfach gefallen.

# Testing
Für das testing haben wir mehrere Tests implementiert. Im ersten Test überprüfen wir, ob der User redirected wird, wenn er nicht authentisiert ist. Anschließend überprüfen wir ob zu Beginn der Runde dem Spieler 7 Handkarten übermittelt werden und danach ob der Spieler eine Karte abheben kann.

Ursprünglich wollten wir noch testen, ob der Spieler Karten hinlegen kann (je nachdem ob er am Zug ist oder nicht). Diese Tests funktionierten jedoch nicht, daher sind sie auskommentiert.

# Continuous Integretation
Bei der Continuous Integretation hatten wir Schwierigkeiten mit der Node-Version 14, aber auf 16 und 18 lauft das Script einwandfrei durch. Der Prozess dies herauszufinden war ein großer Krampf. Zustäzlich hatten wir anfänglich nur Failures weil eine Dependency nicht gefunden wurde. Diese haben wir in der aktuellen Version einfach manuell im node.js.yaml dazuinstalliert.