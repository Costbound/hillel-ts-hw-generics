enum EmployeStatus {
  Active = "Active",
  Inactive = "Inactive",
  Vacation = "Vacation"
}
type DeptBudget = {
  debit: number
  credit: number
}
type PaymentDetails = {
  swift: string
  iBan: string
  number: number,
  correspondentBank: string
}
type AllEmployeTypes = Employe | PreHiredEmploye
// У вас є сутність - Компанія, яка має назву, список департаментів, список попередньо найнятого персоналу, а також список усього персоналу компанії - співробітники всіх департаментів і попередньо найняті.
class Company {
  name: string
  departaments: Departament[] = []
  preHiredEmployes: PreHiredEmploye[] = []
  staff: AllEmployeTypes[] = []

  constructor(name: string) {
    this.name = name
  } 

  get allEmployes(): AllEmployeTypes[] {
    return [...this.departaments.flatMap(({employes}) => employes), ...this.preHiredEmployes]
  }
}

// Сутність Департамент - має назву, доменну область, список своїх співробітників і бюджет, що складається з дебіту і кредиту. Так само у неї існують методи для обчислення балансу виходячи з поточного бюджету, додавання нових співробітників, який враховує зміни балансу і перетворення з Попередньо найнятого на Співробітника або видалення Співробітника з минулого відділу.
class Departament { 
  static idGenerator: number = 0
  readonly id: number

  name: string
  area: string
  employes: Employe[] = []
  budget: DeptBudget

  constructor(name: string, area: string, budget: DeptBudget = {debit: 0, credit: 0}) {
    this.name = name
    this.area = area
    this.budget = budget
    this.id = Departament.idGenerator
    Departament.idGenerator += 1
  }

  get balance(): number {
    return this.budget.debit - this.budget.credit
  }

  addEmployee(employe: Employe | PreHiredEmploye, paymentDetails?: PaymentDetails): void {
    if (Utils.isEmploye(employe)) {
      employe.changeDepartament(this)
      this.budget.credit += employe.salary
      this.employes.push(employe)
    } else if (paymentDetails) {
      const {firstName, lastName, salary} = employe
      const newEmploye = new Employe(firstName, lastName, salary, paymentDetails, this, EmployeStatus.Active)
      this.employes.push(newEmploye)
    } else {
      throw new Error("You must enter payment details to proceed!")
    }
  }
  removeEployee(employeToRemove: Employe): void {
    this.employes = this.employes.filter(employe => employe.id !== employeToRemove.id)
  }
}

// Сутність Попередньо найнятого співробітника має ім'я, прізвище, зарплата та номер банківського рахунку.
class PreHiredEmploye {
  constructor(
    readonly firstName: string,
    readonly lastName: string,
    public salary: number,
    public bankAccountNumber: string) { }
 }

// Сутність Співробітника - ім'я, прізвище, платіжну інформацію, зарплату, статус (активний, неактивний, у неоплачуваній відпустці) і знання про департамент, до якого він прикріплений.
class Employe { 
  private static idGenerator: number = 0
  readonly id: number

  constructor(
    readonly firstName: string,
    readonly lastName: string,
    public salary: number,
    public paymentDetails: PaymentDetails,
    private departament: Departament,
    public status: EmployeStatus = EmployeStatus.Inactive
  ) {
    this.id = Employe.idGenerator
    Employe.idGenerator += 1
  }

  changeDepartament(newDept: Departament): void {
    this.departament.removeEployee(this)
    this.departament = newDept
  }
}

// Так само у нас є сутність Бухгалтерія, яка є департаментом і має властивість баланс, а також методи для взяття на баланс співробітника або департаменту, зняття з балансу і виплати зарплати для всього персоналу.
class Accounting extends Departament {
  salaryBalance: (Employe | Departament)[] = []

  constructor(name: string, area: string) {
    super(name, area)
  }

  addToBalance(entity: Employe | Departament): void {
    this.salaryBalance.push(entity)
  }
  removeFromBalance(entity: Employe | Departament): void {
    this.salaryBalance = this.salaryBalance.filter(({id}) => id !== entity.id)
  }
  internalPayment(employe: Employe): void {
    makeInternalPayment(employe.paymentDetails)
   }
  externalPayment(employe: PreHiredEmploye): void {
    makeExternalPayment(employe.bankAccountNumber)
  }
  payAllSalary(): void {
    this.salaryBalance.forEach(essence => {
      if (Utils.isEmploye(essence)) {
        if (essence.status !== EmployeStatus.Active) {
          this.internalPayment(essence)
        }
      }
    })
  }
}

// Попередньо найняті співробітники отримують зарплату за допомогою зовнішніх оплат, Співробітники (тільки активні) - за допомогою внутрішніх.
class Utils {
  static isEmploye(entity: unknown): entity is Employe {
    return entity instanceof Employe
  }
  static isPreHiredEmploye(entity: unknown): entity is PreHiredEmploye {
    return entity instanceof PreHiredEmploye
  }
  static isDepartament(entity: unknown): entity is Departament {
    return entity instanceof Departament
  }
}

function makeInternalPayment(paymentDetails: PaymentDetails): void {
  // Some bank transaction logic
}
function makeExternalPayment(bankAccNumber: string): void {
  // Some bank transaction logic
}