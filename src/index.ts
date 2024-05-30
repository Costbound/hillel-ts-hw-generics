class School {
  // any тому що массив
  directions: any = [];

  // any так як має бути класс Direction
  addDirection(direction: any): void {
    this.directions.push(direction);
  }
}

class Direction {
  // any тому що массив
  levels: any = [];
  _name: string;

  get name(): string {
    return this._name;
  }

  constructor(name: string) {
    this._name = name;
  }

  // any так як має бути класс Level
  addLevel(level: any): void {
    this.levels.push(level);
  }
}

class Level {
  // any тому що массив
  groups: any = [];
  _name: string;
  _program: string;

  constructor(name: string, program: string) {
    this._name = name;
    this._program = program;
  }

  get name(): string {
    return this._name;
  }

  get program(): string {
    return this._program;
  }

  // any так як має бути класс Group
  addGroup(group: any): void {
    this.groups.push(group);
  }
}

class Group {
  // any тому що массив
  _students: any = [];
  directionName: string;
  levelName: string;

  // any тому що повертає массив _students
  get students(): any {
    return this._students;
  }

  constructor(directionName: string, levelName: string) {
    this.directionName = directionName;
    this.levelName = levelName;
  }

  // any так як має бути класс Student
  addStudent(student: any): void {
    this._students.push(student);
  }

  // any тому що повертає відсортований массив _students
  showPerformance(): any {
    const sortedStudents = this.students.toSorted(
    // any так як має бути екземпляр класу Student
      (a: any, b: any) => b. getPerformanceRating() - a.getPerformanceRating()
    );

    return sortedStudents;
  }

}

class Student {
  // any тому що object
  grades: any = {};
  // any тому що массив
  attendance: any = [];
  firstName: string;
  lastName: string;
  birthYear: number;

  constructor(firstName: string, lastName: string, birthYear: number) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthYear = birthYear;
  }

  get fullName(): string {
    return `${this.lastName} ${this.firstName}`;
  }

  set fullName(value: string) {
    [this.lastName, this.firstName] = value.split(" ");
  }

  get age(): number {
    return new Date().getFullYear() - this.birthYear;
  }

  // grade: number тому що як я зрозумів тут маєтся на увазі відмітка по предмету
  setGrade(subject: string, grade: number): void {
    this.grades[subject] = grade;
  }

  markAttendance(present: boolean): void {
    this.attendance.push(present);
  }

  getPerformanceRating(): number {
    // any тому що массив
    const gradeValues: any = Object.values(this.grades);

    if (gradeValues.length === 0) return 0;

    const averageGrade: number =
      gradeValues.reduce((sum: number, grade: number): number => sum + grade, 0) / gradeValues.length;

    const attendancePercentage: number =
      // any тому що массив
      (this.attendance.filter((present:boolean):any => present).length /
        this.attendance.length) *
      100;

    return (averageGrade + attendancePercentage) / 2;
  }
}