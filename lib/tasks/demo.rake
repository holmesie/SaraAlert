namespace :demo do
  desc "Configure the database for demo use"
  task setup: :environment do
    print 'Creating enrollers...'
    enroller1 = User.new(email: 'enroller1@example.com', password: '123456')
    enroller1.add_role :enroller
    enroller1.save
    enroller2 = User.new(email: 'enroller2@example.com', password: '123456')
    enroller2.add_role :enroller
    enroller2.save
    puts ' done!'

    print 'Creating epis...'
    epi1 = User.new(email: 'epi1@example.com', password: '123456')
    epi1.add_role :monitor
    epi1.save
    puts ' done!'

    print 'Creating patients...'
    patient1 = Patient.new(first_name: 'Example1', last_name: 'Person1', sex: 'Male', dob: Date.today - 44.years - 100.days, creator: enroller1)
    patient1.responder = patient1
    patient1.save
    patient2 = Patient.new(first_name: 'Example2', last_name: 'Person2', sex: 'Female', dob: Date.today - 68.years - 200.days, creator: enroller2)
    patient2.responder = patient2
    patient2.save
    puts ' done!'

    print 'Creating assessments...'
    patient1.assessments.create(status: 'asymptomatic')
    patient1.assessments.create(status: 'asymptomatic')
    patient1.assessments.create(status: 'symptomatic')
    patient2.assessments.create(status: 'asymptomatic')
    patient2.assessments.create(status: 'asymptomatic')
    patient2.assessments.create(status: 'asymptomatic')
    puts ' done!'
  end
end
