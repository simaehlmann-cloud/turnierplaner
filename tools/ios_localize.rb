#!/usr/bin/env ruby
# Bindet l10n/ios/<sprache>.lproj/InfoPlist.strings als lokalisierte Ressource
# in das von Cordova erzeugte Xcode-Projekt ein. Damit zeigt iOS den App-Namen
# und die Texte der Berechtigungsabfragen in der Geraetesprache an
# (Deutsch: TurnierPro, Englisch: TourneyPro).
#
#   ruby tools/ios_localize.rb <build>/platforms/ios <repo>/l10n/ios
#
# Cordova kann das selbst nicht sauber: ein <resource-file> landet flach im
# Bundle, ohne .lproj-Ordner - dann wirkt die Uebersetzung nicht. Deshalb wird
# hier eine echte "Variant Group" angelegt, wie Xcode es beim Lokalisieren tut.
require 'fileutils'
require 'xcodeproj'

ios_dir, l10n_dir = ARGV
abort 'Aufruf: ios_localize.rb <platforms/ios> <l10n/ios>' unless ios_dir && l10n_dir

ios_dir = File.expand_path(ios_dir)
l10n_dir = File.expand_path(l10n_dir)
proj_path = Dir.glob(File.join(ios_dir, '*.xcodeproj')).reject { |p| p.include?('Pods') }.first
abort "Kein Xcode-Projekt in #{ios_dir}" unless proj_path
project = Xcodeproj::Project.open(proj_path)
target = project.targets.find { |t| t.respond_to?(:product_type) && t.product_type == 'com.apple.product-type.application' }
abort 'Kein App-Target gefunden' unless target

# Ordner der Info.plist = Ordner der App-Ressourcen
plist_rel = target.build_configurations.map { |c| c.build_settings['INFOPLIST_FILE'] }.compact.first
abort 'INFOPLIST_FILE nicht gesetzt' unless plist_rel
plist_rel = plist_rel.sub('$(SRCROOT)/', '').sub('${SRCROOT}/', '')
res_rel = File.dirname(plist_rel)
puts "Info.plist: #{plist_rel}  ->  Ressourcen-Ordner: #{res_rel}"

langs = Dir.glob(File.join(l10n_dir, '*.lproj')).map { |d| File.basename(d, '.lproj') }.sort
abort "Keine .lproj-Ordner in #{l10n_dir}" if langs.empty?

# Alte Eintraege (bei wiederholtem Lauf) entfernen
project.main_group.recursive_children.select { |c| c.isa == 'PBXVariantGroup' && c.name == 'InfoPlist.strings' }.each do |vg|
  target.resources_build_phase.files.select { |bf| bf.file_ref == vg }.each(&:remove_from_project)
  vg.remove_from_project
end

vg = project.main_group.new_variant_group('InfoPlist.strings')
langs.each do |lang|
  dest = File.join(ios_dir, res_rel, "#{lang}.lproj")
  FileUtils.mkdir_p(dest)
  FileUtils.cp(File.join(l10n_dir, "#{lang}.lproj", 'InfoPlist.strings'), dest)
  ref = vg.new_reference(File.expand_path(File.join(ios_dir, res_rel, "#{lang}.lproj", 'InfoPlist.strings')))
  ref.name = lang
  ref.last_known_file_type = 'text.plist.strings'
  puts "  + #{lang}.lproj/InfoPlist.strings -> #{ref.path}"
end
target.resources_build_phase.add_file_reference(vg, true)

regions = project.root_object.known_regions || []
project.root_object.known_regions = (regions + langs + ['Base']).uniq
project.save
puts "Bekannte Sprachen: #{project.root_object.known_regions.join(', ')}"
