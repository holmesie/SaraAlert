# frozen_string_literal: true

# Helper methods for the patient model
module PatientHelper # rubocop:todo Metrics/ModuleLength
  def normalize_state_names(pat)
    pat.monitored_address_state = normalize_and_get_state_name(pat.monitored_address_state) || pat.monitored_address_state
    pat.address_state = normalize_and_get_state_name(pat.address_state) || pat.address_state
    adpt = pat.additional_planned_travel_destination_state
    pat.additional_planned_travel_destination_state = normalize_and_get_state_name(adpt) || adpt
  end

  def normalize_name(name)
    return nil if name.nil?

    name.delete(" \t\r\n").downcase
  end

  def normalize_and_get_state_name(name)
    # This list contains all of the same states listed in app/javascript/components/data.js
    state_names = {
      'alabama' => 'Alabama',
      'alaska' => 'Alaska',
      'americansamoa' => 'American Samoa',
      'arizona' => 'Arizona',
      'arkansas' => 'Arkansas',
      'california' => 'California',
      'colorado' => 'Colorado',
      'connecticut' => 'Connecticut',
      'delaware' => 'Delaware',
      'districtofcolumbia' => 'District of Columbia',
      'federatedstatesofmicronesia' => 'Federated States of Micronesia',
      'florida' => 'Florida',
      'georgia' => 'Georgia',
      'guam' => 'Guam',
      'hawaii' => 'Hawaii',
      'idaho' => 'Idaho',
      'illinois' => 'Illinois',
      'indiana' => 'Indiana',
      'iowa' => 'Iowa',
      'kansas' => 'Kansas',
      'kentucky' => 'Kentucky',
      'louisiana' => 'Louisiana',
      'maine' => 'Maine',
      'marshallislands' => 'Marshall Islands',
      'maryland' => 'Maryland',
      'massachusetts' => 'Massachusetts',
      'michigan' => 'Michigan',
      'minnesota' => 'Minnesota',
      'mississippi' => 'Mississippi',
      'missouri' => 'Missouri',
      'montana' => 'Montana',
      'nebraska' => 'Nebraska',
      'nevada' => 'Nevada',
      'newhampshire' => 'New Hampshire',
      'newjersey' => 'New Jersey',
      'newmexico' => 'New Mexico',
      'newyork' => 'New York',
      'northcarolina' => 'North Carolina',
      'northdakota' => 'North Dakota',
      'northernmarianaislands' => 'Northern Mariana Islands',
      'ohio' => 'Ohio',
      'oklahoma' => 'Oklahoma',
      'oregon' => 'Oregon',
      'palau' => 'Palau',
      'pennsylvania' => 'Pennsylvania',
      'puertorico' => 'Puerto Rico',
      'rhodeisland' => 'Rhode Island',
      'southcarolina' => 'South Carolina',
      'southdakota' => 'South Dakota',
      'tennessee' => 'Tennessee',
      'texas' => 'Texas',
      'utah' => 'Utah',
      'vermont' => 'Vermont',
      'virginislands' => 'Virgin Islands',
      'virginia' => 'Virginia',
      'washington' => 'Washington',
      'westvirginia' => 'West Virginia',
      'wisconsin' => 'Wisconsin',
      'wyoming' => 'Wyoming'
    }
    state_names[normalize_name(name)] || nil
  end

  def timezone_for_state(name)
    timezones = {
      'alabama' => '-05:00',
      'alaska' => '-08:00',
      'americansamoa' => '-11:00',
      'arizona' => '-07:00',
      'arkansas' => '-05:00',
      'california' => '-07:00',
      'colorado' => '-06:00',
      'connecticut' => '-04:00',
      'delaware' => '-04:00',
      'districtofcolumbia' => '-04:00',
      'federatedstatesofmicronesia' => '+11:00',
      'florida' => '-04:00',
      'georgia' => '-04:00',
      'guam' => '+10:00',
      'hawaii' => '-10:00',
      'idaho' => '-06:00',
      'illinois' => '-05:00',
      'indiana' => '-04:00',
      'iowa' => '-05:00',
      'kansas' => '-05:00',
      'kentucky' => '-04:00',
      'louisiana' => '-05:00',
      'maine' => '-04:00',
      'marshallislands' => '+12:00',
      'maryland' => '-04:00',
      'massachusetts' => '-04:00',
      'michigan' => '-04:00',
      'minnesota' => '-05:00',
      'mississippi' => '-05:00',
      'missouri' => '-05:00',
      'montana' => '-06:00',
      'nebraska' => '-05:00',
      'nevada' => '-07:00',
      'newhampshire' => '-04:00',
      'newjersey' => '-04:00',
      'newmexico' => '-06:00',
      'newyork' => '-04:00',
      'northcarolina' => '-04:00',
      'northdakota' => '-05:00',
      'northernmarianaislands' => '+10:00',
      'ohio' => '-04:00',
      'oklahoma' => '-05:00',
      'oregon' => '-07:00',
      'palau' => '+09:00',
      'pennsylvania' => '-04:00',
      'puertorico' => '-04:00',
      'rhodeisland' => '-04:00',
      'southcarolina' => '-04:00',
      'southdakota' => '-05:00',
      'tennessee' => '-05:00',
      'texas' => '-05:00',
      'utah' => '-06:00',
      'vermont' => '-04:00',
      'virginislands' => '-04:00',
      'virginia' => '-04:00',
      'washington' => '-07:00',
      'westvirginia' => '-04:00',
      'wisconsin' => '-05:00',
      'wyoming' => '-06:00',
      nil => '-04:00',
      '' => '-04:00'
    }
    timezones[normalize_name(name)] || '-04:00'
  end
end
