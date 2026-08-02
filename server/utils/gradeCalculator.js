function calculateGrade(mark){

    if(mark>=95) 
        return {grade:"A+",gpv:4.0};

    if(mark>=85) 
        return {grade:"A",gpv:4.0};

    if(mark>=80) 
        return {grade:"A-",gpv:3.7};

    if(mark>=75) 
        return {grade:"B+",gpv:3.3};

    if(mark>=70) 
        return {grade:"B",gpv:3.0};

    if(mark>=65) 
        return {grade:"B-",gpv:2.7};

    if(mark>=60) 
        return {grade:"C+",gpv:2.3};

    if(mark>=55) 
        return {grade:"C",gpv:2.0};

    if(mark>=50) 
        return {grade:"C-",gpv:1.7};

    if(mark>=45) 
        return {grade:"D+",gpv:1.3};

    if(mark>=40) return {grade:"D",gpv:1.0};
        return {grade:"E",gpv:0};

}

module.exports = calculateGrade;