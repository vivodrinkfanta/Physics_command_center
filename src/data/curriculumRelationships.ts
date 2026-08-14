import type { CurriculumRelationship } from '../types/curriculumRelationship'

const relationship = (
  id: string,
  topicCode: CurriculumRelationship['topicCode'],
  name: string,
  expression: string,
  meaning: string,
  unitTrace: string,
  assumption: string,
  availability: CurriculumRelationship['availability'] = 'shared',
): CurriculumRelationship => ({ id, topicCode, name, expression, meaning, unitTrace, assumption, availability })

export const curriculumRelationships: readonly CurriculumRelationship[] = [
  relationship('a2-buoyancy', 'A.2', 'Buoyant force', 'Fᵦ = ρVg', 'A displaced fluid produces an upward force equal to the weight of that fluid.', 'N = (kg m⁻³)(m³)(m s⁻²)', 'Fluid density is uniform over the displaced volume.'),
  relationship('a2-drag', 'A.2', 'Quadratic drag model', 'Fᴅ = ½CᴅρAv²', 'At sufficiently high Reynolds number, drag grows with frontal area and the square of relative speed.', 'N = 1(kg m⁻³)(m²)(m² s⁻²)', 'Cᴅ is treated as constant over the modeled speed range.'),
  relationship('a3-efficiency', 'A.3', 'Energy efficiency', 'η = Eᵤₛₑfᵤₗ / Eᵢₙ', 'Efficiency compares the intended energy transfer with the total supplied energy.', '1 = J/J', 'Input and useful output refer to the same process interval.'),
  relationship('a3-force-power', 'A.3', 'Mechanical power at constant velocity', 'P = Fv', 'Power equals the component of force along the velocity multiplied by speed.', 'W = N·m s⁻¹', 'Force and velocity are parallel and steady.'),
  relationship('a4-torque', 'A.4', 'Torque magnitude', 'τ = rF sin θ', 'Torque measures the turning effect of a force about a chosen axis.', 'N·m = m·N', 'r is measured from the axis to the point of application.', 'hl-only'),
  relationship('a4-rotation', 'A.4', 'Rotational dynamics', 'Στ = Iα', 'Net torque changes angular velocity according to rotational inertia.', 'N·m = kg·m²·rad s⁻²', 'The body is rigid and the rotation axis is fixed.', 'hl-only'),
  relationship('a5-galilean', 'A.5', 'Galilean position transformation', "x′ = x − vt", 'Observers in uniform relative motion assign different positions but share Newtonian time.', 'm = m − (m s⁻¹)s', 'Relative speed is much smaller than the speed of light.', 'hl-only'),
  relationship('a5-lorentz', 'A.5', 'Lorentz factor', 'γ = 1 / √(1 − v²/c²)', 'The Lorentz factor controls time dilation, length contraction, and relativistic energy.', '1', 'Frames are inertial and v is their relative speed.', 'hl-only'),
  relationship('b1-heating', 'B.1', 'Sensible heating', 'Q = mcΔT', 'Energy transfer changes temperature according to mass and specific heat capacity.', 'J = kg·J kg⁻¹ K⁻¹·K', 'No phase change occurs during the interval.'),
  relationship('b1-phase', 'B.1', 'Latent heating', 'Q = mL', 'Energy transferred during a phase change alters molecular arrangement without changing temperature.', 'J = kg·J kg⁻¹', 'The material remains at its phase-change temperature.'),
  relationship('b2-radiation', 'B.2', 'Thermal radiation power', 'P = eσAT⁴', 'Emission rises strongly with absolute temperature and depends on emissivity and area.', 'W = W m⁻² K⁻⁴·m²·K⁴', 'The surface has a single absolute temperature.'),
  relationship('b2-balance', 'B.2', 'Radiative equilibrium', 'Pₐᵦₛ = Pₑₘ', 'A stable mean temperature requires absorbed and emitted power to balance.', 'W = W', 'The model averages spatial and temporal variations.'),
  relationship('b3-ideal-gas', 'B.3', 'Ideal gas law', 'PV = nRT', 'Pressure, volume, amount, and absolute temperature are linked for an ideal gas.', 'J = mol·J mol⁻¹ K⁻¹·K', 'Particles have negligible volume and intermolecular forces away from collisions.'),
  relationship('b3-particle-energy', 'B.3', 'Mean translational kinetic energy', 'Ēₖ = 3kT/2', 'Absolute temperature measures mean translational kinetic energy per molecule.', 'J = J K⁻¹·K', 'The gas is monatomic and classical.'),
  relationship('b4-first-law', 'B.4', 'First law of thermodynamics', 'ΔU = Q + Wₒₙ', 'Internal-energy change equals heating plus work done on the system.', 'J = J + J', 'The sign convention for work is stated explicitly.', 'hl-only'),
  relationship('b4-engine', 'B.4', 'Heat-engine efficiency', 'η = Wₒᵤₜ / Qₕ', 'A heat engine converts only part of its hot-reservoir input into work.', '1 = J/J', 'The engine operates over a complete cycle.', 'hl-only'),
  relationship('b5-ohm', 'B.5', 'Ohmic resistance', 'V = IR', 'Potential difference drives current through an ohmic component in proportion to resistance.', 'V = A·Ω', 'Temperature and other physical conditions remain constant.'),
  relationship('b5-electric-power', 'B.5', 'Electrical power', 'P = IV', 'Electrical power is the rate at which charge transfers energy.', 'W = A·V', 'Current and potential difference are evaluated for the same component.'),
  relationship('c1-shm', 'C.1', 'SHM acceleration', 'a = −ω²x', 'Acceleration is proportional to displacement and directed toward equilibrium.', 'm s⁻² = s⁻²·m', 'The restoring response is linear.'),
  relationship('c1-spring-period', 'C.1', 'Mass–spring period', 'T = 2π√(m/k)', 'Greater mass lengthens the oscillation period while greater stiffness shortens it.', 's = √(kg/(N m⁻¹))', 'The spring is ideal and damping is negligible.', 'shared-hl-extension'),
  relationship('c2-wave-speed', 'C.2', 'Wave speed', 'v = fλ', 'A periodic wave advances one wavelength during each period.', 'm s⁻¹ = s⁻¹·m', 'Frequency and wavelength refer to the same medium.'),
  relationship('c2-intensity', 'C.2', 'Wave intensity', 'I = P/A', 'Intensity is power transferred per area normal to propagation.', 'W m⁻² = W/m²', 'Power is distributed uniformly over the stated area.'),
  relationship('c3-refraction', 'C.3', 'Snell’s law', 'n₁ sin θ₁ = n₂ sin θ₂', 'Refraction changes direction because wave speed changes across a boundary.', '1', 'Angles are measured from the normal.'),
  relationship('c3-double-slit', 'C.3', 'Double-slit fringe spacing', 's = λD/d', 'Fringe spacing grows with wavelength and screen distance and shrinks with slit separation.', 'm = m·m/m', 'Small-angle and far-field approximations apply.', 'shared-hl-extension'),
  relationship('c4-string', 'C.4', 'String harmonics', 'fₙ = nv/(2L)', 'Allowed standing waves fit an integer number of half-wavelengths along a fixed string.', 's⁻¹ = m s⁻¹/m', 'Both ends are fixed and the string is uniform.'),
  relationship('c4-resonance', 'C.4', 'Resonance condition', 'f_drive ≈ f₀', 'A driven system responds strongly when the driving frequency approaches a natural frequency.', 'Hz ≈ Hz', 'Damping is finite and the driving amplitude is bounded.'),
  relationship('c5-source', 'C.5', 'Moving-source Doppler shift', "f′ = fv/(v ∓ vₛ)", 'Wavefront spacing changes when a source moves relative to the medium.', 'Hz = Hz·(m s⁻¹)/(m s⁻¹)', 'The observer is stationary in the medium and speeds are collinear.', 'shared-hl-extension'),
  relationship('c5-observer', 'C.5', 'Moving-observer Doppler shift', "f′ = f(v ± vₒ)/v", 'A moving observer encounters wavefronts at a different rate.', 'Hz = Hz·(m s⁻¹)/(m s⁻¹)', 'The source is stationary in the medium and speeds are collinear.'),
  relationship('d1-field', 'D.1', 'Gravitational field strength', 'g = GM/r²', 'A spherical mass produces an inverse-square gravitational field outside its surface.', 'N kg⁻¹ = N m² kg⁻²·kg/m²', 'The source is spherical or can be treated as a point mass.', 'shared-hl-extension'),
  relationship('d1-potential', 'D.1', 'Gravitational potential', 'V = −GM/r', 'Potential is work per unit mass relative to zero at infinity.', 'J kg⁻¹ = N m² kg⁻²·kg/m', 'The source is isolated and spherical.', 'shared-hl-extension'),
  relationship('d2-electric-field', 'D.2', 'Electric field strength', 'E = F/q', 'Electric field is force per unit positive test charge.', 'N C⁻¹ = N/C', 'The test charge is small enough not to disturb the source field.', 'shared-hl-extension'),
  relationship('d2-magnetic-force', 'D.2', 'Magnetic force on charge', 'F = qvB sin θ', 'Magnetic force is perpendicular to both velocity and magnetic field.', 'N = C·m s⁻¹·T', 'The field is uniform over the particle path segment.', 'shared-hl-extension'),
  relationship('d3-electric-motion', 'D.3', 'Electric acceleration', 'a = qE/m', 'A uniform electric field produces constant acceleration for a particle of fixed charge and mass.', 'm s⁻² = C·N C⁻¹/kg', 'Relativistic effects are negligible.'),
  relationship('d3-magnetic-radius', 'D.3', 'Magnetic orbit radius', 'r = mv/(|q|B)', 'A perpendicular magnetic field bends a charged particle into a circular path.', 'm = kg·m s⁻¹/(C·T)', 'Velocity is perpendicular to a uniform field.'),
  relationship('d4-flux', 'D.4', 'Magnetic flux', 'Φ = BA cos θ', 'Flux measures the magnetic field passing normally through an area.', 'Wb = T·m²', 'The field is uniform across a flat loop.', 'hl-only'),
  relationship('d4-faraday', 'D.4', 'Faraday–Lenz law', 'ε = −NΔΦ/Δt', 'Induced emf opposes the change in magnetic flux linkage that produces it.', 'V = Wb/s', 'Average emf is evaluated over the stated interval.', 'hl-only'),
  relationship('e1-photon', 'E.1', 'Photon energy', 'E = hf', 'Electromagnetic radiation exchanges energy in discrete photons.', 'J = J s·s⁻¹', 'A photon has a well-defined frequency.'),
  relationship('e1-nuclear-radius', 'E.1', 'Nuclear radius model', 'R = R₀A¹ᐟ³', 'Nuclear radius grows with the cube root of nucleon number, implying nearly constant density.', 'm = m·1', 'The empirical spherical-nucleus model applies.', 'shared-hl-extension'),
  relationship('e2-de-broglie', 'E.2', 'de Broglie wavelength', 'λ = h/p', 'Matter has a wavelength inversely proportional to momentum.', 'm = J s/(kg m s⁻¹)', 'Momentum is well defined and the particle is non-relativistic unless stated.', 'hl-only'),
  relationship('e2-photoelectric', 'E.2', 'Photoelectric equation', 'Kₘₐₓ = hf − φ', 'Photon energy first overcomes the work function; the remainder becomes electron kinetic energy.', 'J = J − J', 'Electrons are emitted from a clean surface with a defined work function.', 'hl-only'),
  relationship('e3-decay', 'E.3', 'Exponential decay', 'N = N₀e^(−λt)', 'The expected number of undecayed nuclei falls exponentially for a constant decay probability.', '1 = 1·1', 'The sample contains many independent identical nuclei.', 'shared-hl-extension'),
  relationship('e3-half-life', 'E.3', 'Half-life relation', 'T₁/₂ = ln 2 / λ', 'Half-life and decay constant are reciprocal measures of decay rate.', 's = 1/s⁻¹', 'The decay constant is time-independent.', 'shared-hl-extension'),
  relationship('e4-mass-energy', 'E.4', 'Mass–energy release', 'E = Δmc²', 'A decrease in rest mass corresponds to released energy.', 'J = kg·m² s⁻²', 'Initial and final systems include every reaction product.'),
  relationship('e4-chain', 'E.4', 'Neutron multiplication factor', 'k = Nₙₑₓₜ/Nₙₒw', 'The multiplication factor distinguishes subcritical, critical, and supercritical chains.', '1', 'Neutron generations are defined consistently.'),
  relationship('e5-fusion-energy', 'E.5', 'Fusion mass defect', 'E = Δmc²', 'Light nuclei release energy when the bound products have less rest mass.', 'J = kg·m² s⁻²', 'All particle rest masses and emitted radiation are included.'),
  relationship('e5-luminosity', 'E.5', 'Stellar luminosity', 'L = 4πR²σT⁴', 'A star’s luminosity depends on surface area and effective surface temperature.', 'W = m²·W m⁻² K⁻⁴·K⁴', 'The star radiates approximately as a black body.'),
]

export const curriculumRelationshipById = new Map(curriculumRelationships.map((item) => [item.id, item]))

export function getCurriculumRelationships(ids: readonly string[]) {
  return ids.map((id) => curriculumRelationshipById.get(id)).filter((item): item is CurriculumRelationship => Boolean(item))
}
